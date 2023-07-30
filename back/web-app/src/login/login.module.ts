import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';

@Module({
  imports: [ConfigModule],
  controllers: [LoginController],
  providers: [LoginService, FtStrategy]
})
export class LoginModule {}
