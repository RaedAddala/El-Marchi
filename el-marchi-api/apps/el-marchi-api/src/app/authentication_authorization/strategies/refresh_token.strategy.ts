import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { COOKIE_NAME } from '../../common/cookies/cookie.utils';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import type {
  JwtTokenPayload,
  SecretData,
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
          const data: SecretData = request?.signedCookies[COOKIE_NAME];
          if (!data) {
            return null;
          }
          return data.jwtRefreshToken;
        },
      ]),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JwtTokenPayload): Promise<User> {
    if (!payload) {
      throw new BadRequestException('no token payload');
    }
    const data: SecretData = req?.signedCookies[COOKIE_NAME];

    if (!data.jwtRefreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    const customer = await this.usersService.validateJwtRefreshToken(
      payload.sub,
      data.jwtRefreshToken,
      data.refreshTokenId,
    );
    if (!customer) {
      throw new BadRequestException('token expired');
    }
    return customer;
  }
}
