import { AuthorizationError } from '@/core/apiError/apiError.entity';
import { SessionRepository } from '@/core/authentication/session.repository';

interface LogoutUsecaseDependencies {
  sessionDatabase: SessionRepository;
}

interface LogoutUsecaseInput {
  sessionId: string;
}

export const logoutUsecase = async (
  { sessionDatabase }: LogoutUsecaseDependencies,
  { sessionId }: LogoutUsecaseInput
): Promise<void> => {
  if (!sessionId) {
    throw new AuthorizationError({
      path: 'logoutUsecase',
      message: 'user_not_logged_in',
    });
  }
  await sessionDatabase.update(sessionId, { active: false });
};
