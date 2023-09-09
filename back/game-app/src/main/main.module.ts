import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { GameModule } from '../game/game.module';
import { MainService } from './main.service';

@Module({
  imports: [GameModule],
  providers: [MainGateway, MainService],
  exports: [MainService],
})
export class MainModule {}
