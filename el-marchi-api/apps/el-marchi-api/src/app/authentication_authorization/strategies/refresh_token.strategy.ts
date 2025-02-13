import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { inspect } from 'util';
import {
  AuthCookieUtils,
  COOKIE_NAME,
} from '../../common/cookies/cookie.utils';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import type {
  JsonWebTokenCookieData,
  RefreshJwtTokenPayload,
} from '../../common/types/jwt.payload';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    jwtConfig: JwtconfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            const data: JsonWebTokenCookieData | undefined =
              request?.signedCookies[COOKIE_NAME];
            if (!data) {
              return null;
            }
            return data.refreshToken;
          } catch {
            return null;
          }
        },
      ]),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: RefreshJwtTokenPayload): Promise<User> {
    Logger.log(inspect(payload));

    if (!payload) {
      throw new UnauthorizedException();
    }
    const data: JsonWebTokenCookieData | undefined =
      req?.signedCookies[COOKIE_NAME];

    if (!data?.refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.validateJwtRefreshToken(
      payload.sub,
      data.refreshToken,
      data.refreshTokenId,
    );

    // if the the refresh token value is changed then it is necessary to revoke it
    if (!user) {
      await this.usersService.revokeJwtRefreshToken(
        payload.sub,
        data.refreshTokenId,
      );

      if (req.res) {
        AuthCookieUtils.clearAuthTokenCookie(req.res);
      }

      throw new UnauthorizedException();
    }
    return user;
  }
}
