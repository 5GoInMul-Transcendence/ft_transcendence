import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [MailModule, SmsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
