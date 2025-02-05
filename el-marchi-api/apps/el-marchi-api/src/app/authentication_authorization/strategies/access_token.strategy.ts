import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JWTPayload } from '../../common/types/jwt.payload';
import { JwtconfigService } from '../../common/jwtconfig/jwtconfig.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(jwtConfig: JwtconfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getJwtConfig().access.publicKey,
      algorithms: ['ES512'],
      ignoreExpiration: false,
    });
  }

  validate(payload: JWTPayload) {
    return payload;
  }
}
