import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { UserModule } from '../users/user/user.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [MailModule, SmsModule, UserModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
