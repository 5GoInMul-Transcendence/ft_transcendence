import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable,map } from 'rxjs';
import { Res } from './response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();
          const status = context.switchToHttp().getResponse().statusCode;

          if (status == HttpStatus.FOUND) {
            response.status(HttpStatus.OK);
            return Res.redirect(data);
          }

          return Res.ok(data);
        }),
      );
  }
}