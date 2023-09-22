import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private sessionService: SessionService,) {}

  use(req: Request, res: Response, next: NextFunction) {
    const session: any = req.session;

    //test
    console.log('AuthMiddleware session:', session?.id);
    if (!session?.userId) {
      throw new HttpException(RedirectResource.LOGIN, HttpStatus.FOUND); // status 는 다음에 다시 정하기
    }
    if (this.sessionService.isDifferentSessionId(session.userId, session.id)) {
      throw new HttpException(RedirectResource.LOGIN, HttpStatus.FOUND);
    }
    next();
  }
}
