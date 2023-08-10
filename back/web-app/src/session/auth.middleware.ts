import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private sessionService: SessionService,) {}

  use(req: Request, res: Response, next: NextFunction) {
    const session: any = req.session;

    //test
    console.log('AuthMiddleware session:', session?.id);
    if (!session?.userId) {
      throw new HttpException('/login', HttpStatus.FOUND); // status 는 다음에 다시 정하기
    }
    if (this.sessionService.isDifferentSessionId(session.userId, session.id)) {
      throw new HttpException('/login', HttpStatus.FOUND);
    }
    // 만료된 세션을 다시 부여
    // req.session.cookie.expires = new Date(Date.now() + 20000);
    // req.session.regenerate(() => this.sessionService.setSession(session, session.userId));

    next();
  }
}
