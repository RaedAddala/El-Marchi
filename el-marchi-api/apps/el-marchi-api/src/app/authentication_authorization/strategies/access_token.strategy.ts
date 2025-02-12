import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { COOKIE_NAME } from '../../common/cookies/cookie.utils';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import { AccessJwtTokenPayload, AccessTokenData } from '../../common/types/jwt.payload';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    jwtConfig: JwtconfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          try {
            const data: AccessTokenData = request?.signedCookies[COOKIE_NAME];
            if (!data) {
              return null;
            }
            return data.accessToken;
          } catch {
            return null;
          }
        },
      ]),
      secretOrKey: jwtConfig.getJwtConfig().access.publicKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessJwtTokenPayload): Promise<User> {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
