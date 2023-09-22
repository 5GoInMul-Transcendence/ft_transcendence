import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { MainModule } from './main/main.module';

@Module({
  imports: [GameModule, MainModule],
})
export class AppModule {}
