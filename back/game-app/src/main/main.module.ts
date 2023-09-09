import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { GameModule } from '../game/game.module';

@Module({
  imports: [GameModule],
  providers: [MainGateway],
})
export class MainModule {}
