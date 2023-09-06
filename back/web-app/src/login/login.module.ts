import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { UserModule } from 'src/users/user/user.module';
import { SessionModule } from 'src/session/session.module';
import { SignupService } from 'src/signup/signup.service';
import { HashModule } from 'src/common/hash/hash.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    SessionModule,
    HashModule,
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    FtStrategy,
    SignupService,
  ]
})
export class LoginModule {}
