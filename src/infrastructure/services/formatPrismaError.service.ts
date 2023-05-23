import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  ApiError,
  ConflictError,
  NotFoundError,
} from '@/core/apiError/apiError.entity';

export const formatPrismaError = (path: string, error: any) => {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictError({
          path,
          message: 'unique_constraint_violation',
          details: String(error.meta?.target),
          raw: String(error),
        });
      case 'P2022':
        return new NotFoundError({
          path,
          message: 'not_found',
          details: String(error.meta?.target),
          raw: String(error),
        });
      default:
        return new ApiError({
          statusCode: 500,
          type: 'database_error',
          message: error.message,
          path,
          details: error.code,
          raw: String(error),
        });
    }
  } else {
    return new ApiError({
      statusCode: 500,
      type: 'database_error',
      message: error.message,
      path,
      details: error?.code,
      raw: String(error),
    });
  }
};
