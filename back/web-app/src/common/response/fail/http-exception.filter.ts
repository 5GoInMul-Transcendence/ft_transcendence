import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseForm } from '../api-response-form';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
    This is default codes in json method
    timestamp: new Date().toISOString(),
    path: request.url,
  */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message: string = exception.message;

    console.log('Exception filter\nSend Response\n');
    if (status === HttpStatus.FOUND) {
      return (
        response
          .status(200)
          .json(ApiResponseForm.redirect(message))
      );
    }
    if (status === HttpStatus.UNAUTHORIZED) {
      return (
        response
          .status(200)
          .json(ApiResponseForm.chatBad(message))
      );
    }

    return response
      .status(200)
      .json(ApiResponseForm.bad(message));
  }
}