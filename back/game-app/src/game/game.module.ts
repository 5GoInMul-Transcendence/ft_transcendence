import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameCore } from './core/game.core';
import { MainModule } from '../main/main.module';

@Module({
  imports: [MainModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, GameCore],
  exports: [GameService],
})
export class GameModule {}
