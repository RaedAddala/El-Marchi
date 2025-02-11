export type JWTPayload = {
  sub: string;
  email: string;
};

export type RefreshTokenJWTPayload = JWTPayload & { refreshToken: string };
