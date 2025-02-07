import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../../common/redis/redis.service';
import type {
  JWTPayload,
  RefreshTokenJWTPayload,
} from '../../common/types/jwt.payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {

  constructor(
    jwtConfig: JwtconfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!refreshToken) throw new UnauthorizedException('Invalid refresh token');
    const isValid = await this.redisService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    return { ...payload, refreshToken } as RefreshTokenJWTPayload;
  }
}
