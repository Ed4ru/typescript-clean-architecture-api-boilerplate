export interface AccessToken {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    nickname: string;
    email: string;
  };
  session: {
    id: string;
  };
}

export interface RefreshToken {
  userId: string;
  sessionId: string;
}

export type EncodedAccessToken = string;
export type EncodedRefreshToken = string;

export interface ITokenService {
  createAccessToken(payload: AccessToken): EncodedAccessToken;
  createRefreshToken(payload: RefreshToken): EncodedRefreshToken;
  verify(token: string): AccessToken | RefreshToken | null;
  reIssueAccessToken(
    refreshToken: EncodedRefreshToken
  ): Promise<EncodedAccessToken>;
}
