import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { UserModule } from '../users/user/user.module';
import { GameController } from './game.controller';
import { IoClientModule } from 'nestjs-io-client';
import { LadderModule } from '../ladder/ladder.module';
import { AchievementModule } from '../achievement/achievement.module';
import { FriendModule } from '../friend/friend.module';
import { MainUserModule } from '../main/mainuser/main-user.module';

@Module({
  imports: [
    IoClientModule.forRoot({
      uri: 'ws://localhost:8081',
    }),
    UserModule,
    LadderModule,
    AchievementModule,
    FriendModule,
    MainUserModule,
  ],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
