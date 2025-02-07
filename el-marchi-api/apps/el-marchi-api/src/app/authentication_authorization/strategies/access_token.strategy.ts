import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import type { JWTPayload } from '../../common/types/jwt.payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(jwtConfig: JwtconfigService, private readonly logger: Logger
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        try {
          const token = req.cookies['access_token'];
          if (!token) {
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
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload.sub || !payload.email) {
      this.logger.warn(`Invalid token payload structure: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException('Invalid token structure');
    }

    return payload;
  }
}
