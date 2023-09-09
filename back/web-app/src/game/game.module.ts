import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { UserModule } from '../users/user/user.module';
import { GameController } from './game.controller';
import { IoClientModule } from 'nestjs-io-client';

@Module({
  imports: [
    IoClientModule.forRoot({
      uri: 'ws://localhost:8081',
    }),
    UserModule,
  ],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
