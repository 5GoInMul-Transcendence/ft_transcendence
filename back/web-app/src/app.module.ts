import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {SmsModule} from './auth/sms/sms.module';

@Module({
  imports: [ConfigModule.forRoot( { isGlobal:true }), SmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
