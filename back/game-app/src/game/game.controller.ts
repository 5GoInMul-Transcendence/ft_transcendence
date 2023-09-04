import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Builder } from 'builder-pattern';
import { GameMode } from './enums/game-mode.enum';
import { CreateGameReturnDto } from './dto/create-game-return.dto';

@Controller()
export class GameController {
  constructor(private gameService: GameService) {}

  @GrpcMethod('GameService', 'createGame')
  createGame(data: CreateGameDto): CreateGameReturnDto {
    return this.gameService.createGame(
      Builder(CreateGameDto)
        .gameMode(GameMode[data.gameMode.toUpperCase()])
        .build(),
    );
  }
}
