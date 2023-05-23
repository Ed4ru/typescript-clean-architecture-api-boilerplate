import { IUserFull, IUserFullPayload } from '@/core/user/user.entity';
import { ISessionFull } from '@/core/authentication/session.entity';
import { AuthorizationError } from '@/core/apiError/apiError.entity';
import { UserRepository } from '@/core/user/user.repository';
import { SessionRepository } from '@/core/authentication/session.repository';

interface RetrieveSessionUsecaseDependencies {
  userDatabase: UserRepository;
  sessionDatabase: SessionRepository;
}

interface RetrieveSessionUsecaseInput {
  userId: IUserFull['id'];
  sessionId: ISessionFull['id'];
}

interface RetrieveSessionUsecaseOutput {
  user: IUserFullPayload;
  session: ISessionFull;
}

export const retrieveSessionUsecase = async (
  { userDatabase, sessionDatabase }: RetrieveSessionUsecaseDependencies,
  { userId, sessionId }: RetrieveSessionUsecaseInput
): Promise<RetrieveSessionUsecaseOutput> => {
  try {
    const user = await userDatabase.readById(userId);
    const session = await sessionDatabase.readById(sessionId);

    if (!session.active || user.id !== session.userId) {
      throw new AuthorizationError({
        path: 'retrieveSessionUsecase',
        message: 'unauthorized',
      });
    }

    return { user, session };
  } catch (error) {
    throw new AuthorizationError({
      path: 'retrieveSessionUsecase',
      message: 'unauthorized',
    });
  }
};
