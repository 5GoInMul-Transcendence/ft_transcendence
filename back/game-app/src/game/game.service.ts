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
import { ReadyGameDto } from './dto/ready-game.dto';
import { GameUserStatus } from './enums/game-user-status.enum';
import { GameActionStatus } from './enums/gam-action-status.enum';
import { InfoGameRes } from './dto/info-game-res.dto';
import { UpdateGameUserDto } from './gameuser/dto/update-game-user.dto';
import { GameUser } from './gameuser/game-user';
import { StartGameDto } from './dto/start-game-dto';
import { EndGameDto } from './dto/end-game.dto';
import { GameCore } from './core/game.core';

@Injectable()
export class GameService {
  private gameGroups: Map<string, GameGroup>;
  private gameProcessUnits: Map<string, GameProcessUnit>;

  constructor(
    private gameUserService: GameUserService,
    private gameCore: GameCore,
  ) {
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

  readyGame(dto: ReadyGameDto) {
    const gameGroup = this.gameGroups.get(dto.gameKey);

    const user = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(dto.gameKey).build(),
    );
    const rivalUser = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameGroup.rivalGameKey).build(),
    );

    if (user.status !== GameUserStatus.DEFAULT || !rivalUser) {
      return;
    }

    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(dto.gameKey)
        .status(GameUserStatus.GAME_READY)
        .build(),
    );
    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(rivalUser.gameKey)
        .status(GameUserStatus.GAME_READY)
        .build(),
    );

    const gameProcessUnit = this.addGameProcessUnit(
      gameGroup.game,
      user,
      rivalUser,
    );

    for (const gamePlayer of gameProcessUnit.gamePlayers.values()) {
      gamePlayer.client.emit(
        'infoGame',
        Builder(InfoGameRes).status(gameProcessUnit.gameStatus).build,
      );
    }
  }

  async endGame(dto: EndGameDto) {
    // 서버로 데이터 보내기
    console.log('end');
  }

  private startGame(dto: StartGameDto) {
    const gameGroup = this.gameGroups.get(dto.gameKey);

    const user = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(dto.gameKey).build(),
    );

    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(dto.gameKey)
        .status(GameUserStatus.GAME_START)
        .build(),
    );

    const rivalUser = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameGroup.rivalGameKey).build(),
    );

    if (!rivalUser || rivalUser.status !== GameUserStatus.GAME_START) {
      return;
    }

    const gameProcessUnit = this.gameProcessUnits.get(user.gameKey);
    gameProcessUnit.gameStatus = GameActionStatus.PLAY;

    this.gameCore.push(gameProcessUnit);
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

  private addGameProcessUnit(
    game: AbstractGame,
    user: GameUser,
    rivalUser: GameUser,
  ) {
    const gameProcessUnit = Builder(GameProcessUnit)
      .game(game)
      .gamePlayers([user, rivalUser])
      .gameStatus(GameActionStatus.STANDBY)
      .notifyEndGame(this.endGame)
      .build();

    this.gameProcessUnits.set(user.gameKey, gameProcessUnit);
    this.gameProcessUnits.set(rivalUser.gameKey, gameProcessUnit);

    return gameProcessUnit;
  }
}
