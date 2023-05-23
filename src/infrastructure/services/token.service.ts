import config from 'config';
import jwt from 'jsonwebtoken';

import {
  AccessToken,
  RefreshToken,
  ITokenService,
} from '@/core/services/token.service.interface';
import { AuthorizationError } from '@/core/apiError/apiError.entity';

import { UserDatabase } from '@/infrastructure/user/user.database';
import { SessionDatabase } from '@/infrastructure/authentication/session.database';

export class TokenService implements ITokenService {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly userDb?: UserDatabase;
  private readonly sessionDb?: SessionDatabase;

  constructor(reIssue = false) {
    this.privateKey = config.get<string>('privateKey');
    this.publicKey = config.get<string>('publicKey');
    if (reIssue) {
      this.userDb = new UserDatabase();
      this.sessionDb = new SessionDatabase();
    }
  }

  private signJwt(payload: any, options: jwt.SignOptions) {
    return jwt.sign(payload, this.privateKey, {
      ...options,
      algorithm: 'RS256',
    });
  }

  createAccessToken(payload: AccessToken) {
    return this.signJwt(payload, {
      expiresIn: config.get<string>('accessTokenTtl'),
    });
  }

  createRefreshToken(payload: RefreshToken) {
    return this.signJwt(payload, {
      expiresIn: config.get<string>('refreshTokenTtl'),
    });
  }

  verify<T>(token: string) {
    try {
      return jwt.verify(token, this.publicKey) as T;
    } catch (error) {
      throw new AuthorizationError({
        path: 'verifyToken',
        message: 'invalid_token',
        details: `token: ${token}`,
        raw: String(error),
      });
    }
  }

  async reIssueAccessToken(refreshToken: string) {
    const { userId, sessionId } = this.verify<RefreshToken>(refreshToken);

    let session, user;
    await Promise.all([
      (session = await this.sessionDb?.readById(sessionId)),
      (user = await this.userDb?.readById(userId)),
    ]);

    if (!session?.active || !user)
      throw new AuthorizationError({
        path: 'reIssueAccessToken',
        message: 'invalid_token',
        details: 'active_session_not_found',
      });

    return this.createAccessToken({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        nickname: user.nickname,
        email: user.email,
      },
      session: {
        id: session.id,
      },
    });
  }
}
