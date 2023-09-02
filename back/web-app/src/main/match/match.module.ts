import { Module } from '@nestjs/common';
import { GameModule } from '../../game/game.module';
import { FriendModule } from '../../friend/friend.module';
import { MatchService } from './match.service';
import { MatchQueue } from './match-queue';
import { MainUserModule } from '../mainuser/main-user.module';
import { UserModule } from '../../users/user/user.module';

@Module({
  imports: [UserModule, GameModule, MainUserModule, FriendModule],
  providers: [MatchService, MatchQueue],
  exports: [MatchService],
})
export class MatchModule {}
