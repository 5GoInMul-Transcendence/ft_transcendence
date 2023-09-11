import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { UserModule } from '../users/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';
import { User } from '../users/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GameHistory]),
    ClientsModule.register([
      {
        name: 'GAME_SERVER',
        transport: Transport.GRPC,
        options: {
          package: 'game',
          url: 'localhost:8081',
          protoPath: __dirname + '/proto/game.proto',
        },
      },
    ]),
    UserModule,
  ],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
