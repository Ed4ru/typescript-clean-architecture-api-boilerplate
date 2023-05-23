export interface IApiError {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  userId?: string | null;
  userIp?: string | null;

  type: string;
  statusCode: number;
  message: string;
  details?: string | null;
  path: string;
  raw?: string | null;
}

export type IApiErrorFull = Required<ApiError>;
export type IApiErrorCustom = Omit<IApiError, 'type' | 'statusCode'>;

export class ApiError {
  id;
  createdAt;
  updatedAt;
  userId;
  userIp;
  type;
  statusCode;
  message;
  details;
  path;
  raw;

  constructor(data: IApiError) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.userId = data.userId;
    this.userIp = data.userIp;
    this.type = data.type;
    this.statusCode = data.statusCode;
    this.message = data.message;
    this.details = data.details;
    this.path = data.path;
    this.raw = data.raw;
  }
}

export class ValidationError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 400,
      type: 'validation_error',
    });
  }
}

export class CredentialsError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 401,
      type: 'invalid_credentials',
    });
  }
}

export class AuthorizationError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 403,
      type: 'unauthorized',
    });
  }
}

export class NotFoundError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 404,
      type: 'not_found',
    });
  }
}

export class ConflictError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 409,
      type: 'conflict',
    });
  }
}

export class ServerError extends ApiError {
  constructor(data: IApiErrorCustom) {
    super({
      ...data,
      statusCode: 500,
      type: 'internal_server_error',
    });
  }
}
