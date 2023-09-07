import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { GameMode } from './enums/game-mode.enum';
import { AbstractGame } from './mode/game.abstract';
import { ClassicGame } from './mode/classic-game';
import { GoldenPongGame } from './mode/golden-pong-game';
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
import { DeleteGameUserDto } from './gameuser/dto/delete-game-user.dto';
import { CheckDisconnectByReconnectionDto } from './dto/check-disconnect-by-reconnection.dto';
import { PlayerAction } from './mode/enums/player-action.enum';
import { DisconnectGameDto } from './dto/disconnect-game-dto';

@Injectable()
export class GameService {
  private reconnection = Symbol('reconnection');
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
      dto.client[this.reconnection] = true;
      throw new WsException('');
    }
  }

  checkDisconnectByReconnection(dto: CheckDisconnectByReconnectionDto) {
    if (dto.client[this.reconnection]) {
      throw new WsException('');
    }
  }

  connectGame(dto: ConnectGameDto) {
    this.gameUserService.addUser(
      Builder(AddGameUserDto).gameKey(dto.gameKey).client(dto.client).build(),
    );
  }

  disconnectGame(dto: DisconnectGameDto) {
    this.gameGroups.delete(dto.gameKey);
    this.gameProcessUnits.delete(dto.gameKey);
    this.gameUserService.deleteUser(
      Builder(DeleteGameUserDto).gameKey(dto.gameKey).build(),
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
        Builder(InfoGameRes).status(gameProcessUnit.gameStatus).build(),
      );
    }
  }

  startGame(dto: StartGameDto) {
    const gameGroup = this.gameGroups.get(dto.gameKey);

    const user = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(dto.gameKey).build(),
    );

    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(dto.gameKey)
        .status(GameUserStatus.GAME_WAIT_START)
        .build(),
    );

    const rivalUser = this.gameUserService.findUserByGameKey(
      Builder(FindGameUserByGameKeyDto).gameKey(gameGroup.rivalGameKey).build(),
    );

    if (
      user.status !== GameUserStatus.GAME_WAIT_START ||
      !rivalUser ||
      rivalUser.status !== GameUserStatus.GAME_WAIT_START
    ) {
      return;
    }

    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(user.gameKey)
        .status(GameUserStatus.GAME_START)
        .build(),
    );
    this.gameUserService.updateUserStatus(
      Builder(UpdateGameUserDto)
        .gameKey(rivalUser.gameKey)
        .status(GameUserStatus.GAME_START)
        .build(),
    );

    const gameProcessUnit = this.gameProcessUnits.get(user.gameKey);
    gameProcessUnit.gameStatus = GameActionStatus.PLAY;

    this.gameCore.push(gameProcessUnit);
  }

  async endGame(dto: EndGameDto) {
    for (const gamePlayer of dto.gamePlayers) {
      gamePlayer.client.disconnect();
    }
    // web-app 서버로 게임결과 보내기
  }

  updateGameObject(gameKey: string, playerAction: PlayerAction) {
    const gameGroup = this.gameGroups.get(gameKey);
    const gameProcessUnit = this.gameProcessUnits.get(gameKey);

    gameProcessUnit?.updateObject(gameGroup.playerNumber, playerAction);
  }

  private generateGame(gameMode: GameMode): AbstractGame {
    switch (gameMode) {
      case GameMode.CLASSIC:
        return new ClassicGame();
      case GameMode.PADDLE:
        return new GoldenPongGame();
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
