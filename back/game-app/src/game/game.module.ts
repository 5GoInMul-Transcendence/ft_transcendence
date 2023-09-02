import { Module } from '@nestjs/common';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  providers: [],
})
export class GameModule {}
