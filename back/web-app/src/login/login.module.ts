import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { UserModule } from 'src/users/user.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    SessionModule,
  ],
  controllers: [LoginController],
  providers: [LoginService, FtStrategy,]
})
export class LoginModule {}
