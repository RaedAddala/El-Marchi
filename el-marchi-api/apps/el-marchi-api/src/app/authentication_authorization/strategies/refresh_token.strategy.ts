import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import type { JWTPayload } from "../../common/types/jwt.payload";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "my very amazing secret that is soooo secure!!!!",
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: JWTPayload) {
    const refreshToken = req.headers.authorization?.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken
    };
  }

}
