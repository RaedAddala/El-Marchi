export interface JwtTokenPayload {
  sub: string;
}

export interface SecretData {
  jwtAccessToken: string;
  jwtRefreshToken: string;
  refreshTokenId: string;
}
