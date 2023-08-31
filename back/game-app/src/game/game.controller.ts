import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { IGame } from './interface/game.interface';

@Controller()
export class GameController {
  @GrpcMethod('GameService', 'createGame')
  createGame(data: Empty): IGame {
    const gameInfo = {
      gameId: 'gameId',
      p1GameKey: 'p1GameKey',
      p2GameKey: 'p2GameKey',
    };
    return gameInfo;
  }
}
