import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
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
    const message: string = this.getExceptionMessage(exception);

    console.log('Exception filter\nSend Response\n');
    if (status === HttpStatus.FOUND) {
      return (
        response
          .status(400)
          .json(ApiResponseForm.redirect(message))
      );
    }
    if (status === HttpStatus.UNAUTHORIZED) {
      return (
        response
          .status(400)
          .json(ApiResponseForm.chatBad(message))
      );
    }

    return response
      .status(400)
      .json(ApiResponseForm.bad(message));
  }

  private getExceptionMessage(exception: HttpException) {
    if (exception instanceof BadRequestException) {
      return (exception as any).getResponse().message[0];
    }

    return exception.message;
  }
}
