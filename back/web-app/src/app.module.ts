import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {SmsModule} from './auth/sms/sms.module';
import {MailModule} from './auth/mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot( { isGlobal:true }), SmsModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
