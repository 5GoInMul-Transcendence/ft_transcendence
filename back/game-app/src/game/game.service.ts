import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { GameMode } from './enums/game-mode.enum';
import { AbstractGame } from './mode/game.abstract';
import { ClassicGame } from './mode/classic-game';
import { PaddleGame } from './mode/paddle-game';
import { SpeedGame } from './mode/speed-game';
import { Builder } from 'builder-pattern';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateGameReturnDto } from './dto/create-game-return.dto';
import { GameGroup } from './game-group';
import { PlayerNumber } from './enums/player-number.enum';

@Injectable()
export class GameService {
  private gameGroups: Map<string, GameGroup>;

  constructor() {
    this.gameGroups = new Map<string, GameGroup>();
  }

  createGame(dto: CreateGameDto): CreateGameReturnDto {
    const game = this.generateGame(dto.gameMode);

    const p1GameKey = uuid();
    const p2GameKey = uuid();

    this.gameGroups.set(
      p1GameKey,
      Builder(GameGroup)
        .game(game)
        .playerNumber(PlayerNumber.P1)
        .rivalGameKey(p2GameKey)
        .build(),
    );
    this.gameGroups.set(
      p2GameKey,
      Builder(GameGroup)
        .game(game)
        .playerNumber(PlayerNumber.P2)
        .rivalGameKey(p1GameKey)
        .build(),
    );

    return Builder(CreateGameReturnDto)
      .gameId(game.gameId)
      .p1GameKey(p1GameKey)
      .p2GameKey(p2GameKey)
      .build();
  }

  private generateGame(gameMode: GameMode): AbstractGame {
    switch (gameMode) {
      case GameMode.CLASSIC:
        return new ClassicGame();
      case GameMode.PADDLE:
        return new PaddleGame();
      case GameMode.SPEED:
        return new SpeedGame();
    }
  }
}
