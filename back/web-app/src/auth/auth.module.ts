import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from './mail/mail.module';
import { UserModule } from '../users/user/user.module';

@Module({
  imports: [MailModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
