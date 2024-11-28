import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseStatus } from '@Common/enums/responseStatus.enum';

@Catch(HttpException)
export class RestfulExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      status_code: statusCode,
      message: (exception.message || ResponseStatus.failed).toLowerCase(),
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: this._getStack(exception),
    });
  }

  private _getStack(exception: HttpException): string[] {
    let stack = undefined;
    if (exception.getResponse()) {
      stack = exception.getResponse()['message'];
    }
    return stack && !Array.isArray(stack) ? [stack] : stack;
  }
}
