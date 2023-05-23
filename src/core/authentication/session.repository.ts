import {
  ISessionFull,
  ISessionIds,
  Session,
} from '@/core/authentication/session.entity';

export interface SessionRepository {
  create(data: Session): Promise<ISessionFull>;
  readById(id: ISessionFull['id']): Promise<ISessionFull>;
  revokeAllExceptOne(data: ISessionIds): Promise<void>;
  update(id: ISessionFull['id'], data: Partial<Session>): Promise<ISessionFull>;
}
