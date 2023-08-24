import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { sessionMiddleware } from './session.middleware';

@Module({
  providers: [SessionService, sessionMiddleware],
  exports: [SessionService, sessionMiddleware],
})
export class SessionModule {}
