import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [GameModule],
  providers: [AppGateway],
})
export class AppModule {}
