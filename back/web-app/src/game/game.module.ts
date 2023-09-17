import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { UserModule } from '../users/user/user.module';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';
import { User } from '../users/user/entities/user.entity';
import { IoClientModule } from 'nestjs-io-client';
import { LadderModule } from '../ladder/ladder.module';
import { AchievementModule } from '../achievement/achievement.module';
import { FriendModule } from '../friend/friend.module';
import { MainUserModule } from '../main/mainuser/main-user.module';
import { ioClientOption } from './game.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GameHistory]),
    IoClientModule.forRootAsync(ioClientOption),
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
