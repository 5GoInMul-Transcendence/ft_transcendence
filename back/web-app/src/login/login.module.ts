import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule,
    // TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [LoginController],
  providers: [LoginService, FtStrategy,]
})
export class LoginModule {}
