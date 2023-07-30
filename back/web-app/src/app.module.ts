import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LoginModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
