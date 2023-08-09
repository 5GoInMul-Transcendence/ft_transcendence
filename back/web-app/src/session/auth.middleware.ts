import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private sessionService: SessionService,) {} // test

  use(req: Request, res: Response, next: NextFunction) {
    // console.log(req.session);
    const session: any = req.session;

    //test
    console.log('AuthMiddleware session', session?.id);
    // req 에 세션 존재 여부
    // 들어왔는데 세션이 없을 때
    // 유저가 직접 id 를 변경했을 때
    // 로그인도 안 했는데 URL 로 직접 /main 등에 접근했을 때
    if (!session?.userId) { // appmodule 에서 로그인할 때는 무시하도록 세팅하기
      throw new HttpException('/login', HttpStatus.FOUND); // status 는 다음에 다시 정하기
      // HttpStatus.MOVED_PERMANENTLY 301 영구 이동으로 페이지를 받았다면 해당 url 로 접근하는 것은 항상 해당 페이지로 리다이렉션 된다. 이는 브라우저 레벨에서 하는 일이라서 처음에 어떻게 해결할지 몰랐다.
    }
    /* 위와 통합함
    // 세션 내 userId 존재 확인
    if (!session.userId) { // 2FA 활성화 되었지만 인증은 실패했을 때
      throw new HttpException('/login', HttpStatus.MOVED_PERMANENTLY);
    }
    */
    // 로그인 잘 됨
    // 들어왔는데 세션은 있으나 유저 아이디가 유효하지 않을 때
    if (this.sessionService.isDifferentSessionId(session.userId, session.id)) {
      throw new HttpException('/login', HttpStatus.FOUND);
    }
    // 만료된 세션을 다시 부여
    // req.session.cookie.expires = new Date(Date.now() + 20000);
    // req.session.regenerate(() => this.sessionService.setSession(session, session.userId));

    next();
  }
}
