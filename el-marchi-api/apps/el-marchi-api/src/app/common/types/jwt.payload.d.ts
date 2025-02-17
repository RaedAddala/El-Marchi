export interface AccessJwtTokenPayload {
  sub: string;
}

export interface RefreshJwtTokenPayload {
  sub: string;
}

export interface JsonWebTokenCookieData {
  refreshToken: string;
  refreshTokenId: string;
}
