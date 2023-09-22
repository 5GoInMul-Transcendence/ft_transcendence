import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable,map } from 'rxjs';
import { ApiResponseForm } from '../api-response-form';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // test
    console.log('Pre interceptor');
    console.log('Controller');
    const now = Date.now();
    return next
      .handle()
      .pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();
          const status = context.switchToHttp().getResponse().statusCode;

          // test
          console.log('Post interceptor\nSend Response\n');

          if (status === HttpStatus.FOUND) {
            response.status(HttpStatus.OK);
            return ApiResponseForm.redirect(data);
          }
          response.status(HttpStatus.OK);
          return ApiResponseForm.ok(data);
        }),
      );
  }
}