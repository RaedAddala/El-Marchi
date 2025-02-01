import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type {
  JWTPayload,
  RefreshTokenJWTPayload,
} from '../../common/types/jwt.payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'my very amazing secret that is soooo secure!!!!',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JWTPayload) {
    const refreshToken = req.headers.authorization
      ?.replace('Bearer', '')
      .trim();
    return {
      ...payload,
      refreshToken,
    } as RefreshTokenJWTPayload;
  }
}
