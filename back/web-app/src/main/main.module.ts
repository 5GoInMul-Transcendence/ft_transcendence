import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { SessionModule } from '../session/session.module';
import { MainService } from './main.service';
import { UserModule } from '../users/user/user.module';
import { MatchModule } from './match/match.module';
import { MainUserModule } from './mainuser/main-user.module';

@Module({
  imports: [SessionModule, UserModule, MatchModule, MainUserModule],
  providers: [MainGateway, MainService],
})
export class MainModule {}
