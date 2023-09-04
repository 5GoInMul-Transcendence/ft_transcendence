import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameUserService } from './gameuser/game-user.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, GameUserService],
})
export class GameModule {}
