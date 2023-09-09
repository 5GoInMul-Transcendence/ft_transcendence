import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameUserService } from './gameuser/game-user.service';
import { GameCore } from './core/game.core';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, GameUserService, GameCore],
  exports: [GameService],
})
export class GameModule {}
