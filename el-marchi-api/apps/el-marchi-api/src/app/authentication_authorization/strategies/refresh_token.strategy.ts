import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type {
  JWTPayload,
  RefreshTokenJWTPayload,
} from '../../common/types/jwt.payload';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    jwtConfig: JwtconfigService,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      algorithms: ['ES512'],
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    const isValid = await this.redisService.validateRefreshToken(payload.sub, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    return { ...payload, refreshToken } as RefreshTokenJWTPayload;
  }
}
