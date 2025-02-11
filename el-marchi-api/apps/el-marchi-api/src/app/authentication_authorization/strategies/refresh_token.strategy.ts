import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().refresh.publicKey,
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    if (!payload || !payload.sub) {
      this.logger.warn(
        `Invalid refresh token payload: ${JSON.stringify(payload)}`,
      );
      throw new UnauthorizedException('Invalid token');
    }

    const refreshToken = req.get('Authorization')?.split(' ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const isValid = await this.redisService.validateRefreshToken(
        payload.sub,
        refreshToken,
      );

      if (!isValid) {
        this.logger.warn(`Invalid refresh token for user ${payload.sub}`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      return { ...payload, refreshToken } as RefreshTokenJWTPayload;
    } catch (error) {
      this.logger.error(
        `Refresh token validation error for user ${payload.sub}:`,
        error,
      );
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
