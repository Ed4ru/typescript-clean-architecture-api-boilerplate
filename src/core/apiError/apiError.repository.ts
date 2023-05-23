import { IApiError, IApiErrorFull } from '@/core/apiError/apiError.entity';

export interface ApiErrorRepository {
  create(apiError: IApiError): Promise<IApiErrorFull>;
}
