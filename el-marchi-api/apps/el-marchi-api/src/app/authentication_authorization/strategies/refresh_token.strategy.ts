import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import type {
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: RefreshJwtTokenPayload): Promise<User> {
    if (!payload) {
      throw new BadRequestException('no token payload');
    }
    const data = req.headers.authorization?.split(' ')[1];

    if (!data) {
      throw new BadRequestException('invalid refresh token');
    }

    const user = await this.usersService.validateJwtRefreshToken(
      payload.sub,
      data,
      payload.refreshTokenId,
    );

    if (!user) {
      throw new BadRequestException('token expired');
    }
    return user;
  }
}
