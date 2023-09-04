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
import { ConnectGameDto } from './dto/connect-game.dto';
import { AddGameUserDto } from './gameuser/dto/add-game-user.dto';
import { GameUserService } from './gameuser/game-user.service';
import { FindGameUserByGameKeyDto } from './gameuser/dto/find-game-user-by-game-key.dto';
import { GameProcessUnit } from './game-process-unit';
import { WsException } from '@nestjs/websockets';
import { CheckGameKeyDto } from './dto/check-game-key.dto';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';

@Injectable()
export class GameService {
  private gameGroups: Map<string, GameGroup>;
  private gameProcessUnits: Map<string, GameProcessUnit>;

  constructor(private gameUserService: GameUserService) {
    this.gameGroups = new Map<string, GameGroup>();
    this.gameProcessUnits = new Map<string, GameProcessUnit>();
  }

  checkGameKey(dto: CheckGameKeyDto) {
    const game = this.gameGroups.get(dto.gameKey);

    if (!game) {
      throw new WsException('');
    }
  }

  checkReconnection(dto: CheckReconnectionDto) {
    const user = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(dto.gameKey).build(),
    );

    if (user) {
      throw new WsException('');
    }
  }

  connectGame(dto: ConnectGameDto) {
    this.gameUserService.addUser(
      Builder(AddGameUserDto).gameKey(dto.gameKey).client(dto.client).build(),
    );

    if (this.isRivalUserConnected(dto.gameKey)) {
      this.addGameProcessUnit(dto.gameKey);
    }
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

  private addGameProcessUnit(gameKey: string) {
    const gameGroup = this.gameGroups.get(gameKey);

    const user = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameKey).build(),
    );
    const rivalUser = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameGroup.rivalGameKey).build(),
    );

    const gameProcessUnit = Builder(GameProcessUnit)
      .game(gameGroup.game)
      .gamePlayers([user, rivalUser])
      .build();

    this.gameProcessUnits.set(user.gameKey, gameProcessUnit);
    this.gameProcessUnits.set(rivalUser.gameKey, gameProcessUnit);
  }

  private isRivalUserConnected(gameKey: string) {
    const gameGroup = this.gameGroups.get(gameKey);

    const rivalUser = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameGroup.rivalGameKey).build(),
    );

    return !!rivalUser;
  }
}
