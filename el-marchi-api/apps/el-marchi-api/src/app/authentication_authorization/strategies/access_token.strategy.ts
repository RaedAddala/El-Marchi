import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { inspect } from 'util';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import { AccessJwtTokenPayload } from '../../common/types/jwt.payload';
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().access.publicKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessJwtTokenPayload): Promise<User> {
    Logger.log(inspect(payload));

    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
