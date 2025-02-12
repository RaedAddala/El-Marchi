export interface AccessJwtTokenPayload {
  sub: string;
}

export interface RefreshJwtTokenPayload {
  sub: string;
  refreshTokenId: string;
}

export interface AccessTokenData {
  accessToken: string;
  refreshTokenId: string;
}
