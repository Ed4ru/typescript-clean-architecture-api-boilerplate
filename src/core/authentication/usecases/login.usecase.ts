import { IUserFull, IUserFullWithoutSessions } from '@/core/user/user.entity';
import {
  ISession,
  ISessionFull,
  Session,
} from '@/core/authentication/session.entity';
import { CredentialsError } from '@/core/apiError/apiError.entity';
import { UserRepository } from '@/core/user/user.repository';
import { SessionRepository } from '@/core/authentication/session.repository';
import {
  EncodedAccessToken,
  EncodedRefreshToken,
  ITokenService,
} from '@/core/services/token.service.interface';
import { ICryptoService } from '@/core/services/crypto.service.interface';

interface LoginUsecaseDependencies {
  userDatabase: UserRepository;
  sessionDatabase: SessionRepository;
  cryptoService: ICryptoService;
  tokenService: ITokenService;
}

interface LoginUsecaseInput {
  email: IUserFull['email'];
  password: IUserFull['password'];
  userAgent: ISession['userAgent'];
}

interface LoginUsecaseOutput {
  user: IUserFullWithoutSessions;
  session: ISessionFull;
  accessToken: EncodedAccessToken;
  refreshToken: EncodedRefreshToken;
}

export const loginUsecase = async (
  {
    userDatabase,
    sessionDatabase,
    cryptoService,
    tokenService,
  }: LoginUsecaseDependencies,
  { email, password, userAgent }: LoginUsecaseInput
): Promise<LoginUsecaseOutput> => {
  let foundUser;
  try {
    foundUser = await userDatabase.readByEmail(email);
  } catch (error) {
    throw new CredentialsError({
      path: 'loginUsecase',
      message: 'invalid_credentials',
    });
  }

  const isPasswordValid = await cryptoService.compare(
    password,
    foundUser.password
  );
  if (!isPasswordValid) {
    throw new CredentialsError({
      path: 'loginUsecase',
      message: 'invalid_credentials',
    });
  }

  const sessionData = new Session({
    active: true,
    userId: foundUser.id,
    userAgent: userAgent,
  });

  const newSession = await sessionDatabase.create(sessionData);

  sessionDatabase.revokeAllExceptOne({
    id: newSession.id,
    userId: foundUser.id,
  });

  const accessToken = tokenService.createAccessToken({
    user: {
      id: foundUser.id,
      email: foundUser.email,
      firstname: foundUser.firstname,
      lastname: foundUser.lastname,
      nickname: foundUser.nickname,
    },
    session: {
      id: newSession.id,
    },
  });

  const refreshToken = tokenService.createRefreshToken({
    userId: foundUser.id,
    sessionId: newSession.id,
  });

  return {
    user: foundUser,
    session: newSession,
    accessToken,
    refreshToken,
  };
};
