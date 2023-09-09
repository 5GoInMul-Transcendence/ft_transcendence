import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { UserModule } from '../users/user/user.module';
import { GameController } from './game.controller';

@Module({
  imports: [UserModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
