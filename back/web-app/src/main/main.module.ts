import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { SessionModule } from '../session/session.module';
import { MainService } from './main.service';
import { UserModule } from '../users/user/user.module';
import { MainUserService } from './main-user.service';

@Module({
  imports: [SessionModule, UserModule],
  providers: [MainGateway, MainService, MainUserService],
})
export class MainModule {}
