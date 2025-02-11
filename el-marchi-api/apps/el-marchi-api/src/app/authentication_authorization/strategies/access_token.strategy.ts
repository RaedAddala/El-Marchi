import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import type { JWTPayload } from '../../common/types/jwt.payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(jwtConfig: JwtconfigService, private readonly logger: Logger) {
    super({
      jwtFromRequest: (req: Request) => {
        try {
          if (!req.signedCookies) {
            this.logger.warn('No signed cookies found in request');
            return null;
          }

          const token = req.signedCookies['access_token'];
          if (!token) {
            this.logger.debug('No access token found in signed cookies');
            return null;
          }

          return token;
        } catch (error) {
          this.logger.error('Error extracting access token:', error);
          return null;
        }
      },
      secretOrKey: jwtConfig.getJwtConfig().access.publicKey,
      ignoreExpiration: false,
    });
  }

  validate(payload: JWTPayload) {
    if (!payload?.sub || !payload?.email) {
      this.logger.warn('Invalid token payload structure', {
        sub: !!payload?.sub,
        email: !!payload?.email
      });
      throw new UnauthorizedException('Invalid token structure');
    }

    return payload;
  }
}
