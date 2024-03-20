import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ForbiddenException
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Startup');
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception);
    console.error('', exception);
    const isForbiddenError = exception instanceof ForbiddenException;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const mongooseValidationError = mongoose.Error.ValidationError;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as {
        message: string[] | string;
      };
      let error: string;
      if (Array.isArray(errorResponse.message)) {
        error = errorResponse.message[0];
      } else {
        error = errorResponse.message;
      }
      if (isForbiddenError && errorResponse.message === 'forbidden') {
        error = 'Unauthorized access: You are not allowed to take this action.';
      }
      return response.status(status).json({
        status: 'error',
        error: error,
        errors: Array.isArray(errorResponse.message)
          ? errorResponse.message
          : undefined
      });
    }

    if (exception instanceof mongooseValidationError) {
      const errorMessages: string[] = Object.values(exception.errors).map(
        (e: any) => e.message
      );
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        error: errorMessages[0],
        errors: errorMessages
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: 'Something went wrong. Please try again later'
    });
  }
}
