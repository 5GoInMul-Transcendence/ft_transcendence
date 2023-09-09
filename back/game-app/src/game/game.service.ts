import { Injectable } from '@nestjs/common';
import { GameMode } from './mode/enums/game-mode.enum';
import { AbstractGame } from './mode/game.abstract';
import { ClassicGame } from './mode/classic-game';
import { GoldenPongGame } from './mode/golden-pong-game';
import { SpeedGame } from './mode/speed-game';
import { Builder } from 'builder-pattern';
import { CreateGameDto } from './dto/create-game.dto';
import { GameGroup } from './game-info';
import { ConnectGameDto } from './dto/connect-game.dto';
import { GameProcessUnit } from './game-process-unit';
import { WsException } from '@nestjs/websockets';
import { CheckGameKeyDto } from './dto/check-game-key.dto';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';
import { ReadyGameDto } from './dto/ready-game.dto';
import { GameStatus } from './mode/enums/game-status.enum';
import { InfoGameRes } from './dto/info-game-res.dto';
import { StartGameDto } from './dto/start-game-dto';
import { EndGameDto } from './dto/end-game.dto';
import { GameCore } from './core/game.core';
import { CheckDisconnectByReconnectionDto } from './dto/check-disconnect-by-reconnection.dto';
import { PlayerAction } from './player/enums/player-action.enum';
import { DisconnectGameDto } from './dto/disconnect-game-dto';

@Injectable()
export class GameService {
  private reconnection = Symbol('reconnection');
  private gameGroup: Map<string, GameGroup>;
  private gameProcessUnits: Map<string, GameProcessUnit>;

  constructor(
    private gameCore: GameCore,
  ) {
    this.gameGroup = new Map<string, GameGroup>();
    this.gameProcessUnits = new Map<string, GameProcessUnit>();
  }

  checkGameKey(dto: CheckGameKeyDto) {
    const game = this.gameGroup.get(dto.gameKey);

    if (!game) {
      throw new WsException('');
    }
  }

  checkReconnection(dto: CheckReconnectionDto) {
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
  }

  disconnectGame(dto: DisconnectGameDto) {
    const gameGroup = this.gameGroup.get(dto.gameKey);
    
    this.gameGroup.delete(dto.gameKey);
    this.gameProcessUnits.delete(dto.gameKey);
  }

  
  createGame(dto: CreateGameDto) {
    const game = this.generateGame(dto.gameId, dto.gameMode);

    this.gameGroup.set(
      dto.p1GameKey,
      Builder(GameGroup)
        .game(game)
        .rivalGameKey(dto.p2GameKey)
        .build(),
    );
    this.gameGroup.set(
      dto.p2GameKey,
      Builder(GameGroup)
        .game(game)
        .playerNumber(PlayerNumber.P2)
        .rivalGameKey(dto.p1GameKey)
        .build(),
    );
  }

  readyGame(dto: ReadyGameDto) {
    const gameGroup = this.gameGroup.get(dto.gameKey);
    
    const gameProcessUnit = this.addGameProcessUnit(
      gameGroup.game,
    );

    for (const gamePlayer of gameProcessUnit.gamePlayers.values()) {
      gamePlayer.client.emit(
        'infoGame',
        Builder(InfoGameRes).status(gameProcessUnit.gameStatus).build(),
      );
    }
  }

  startGame(dto: StartGameDto) {
    const gameGroup = this.gameGroup.get(dto.gameKey);

    const gameProcessUnit = this.gameProcessUnits.get(user.gameKey);
    gameProcessUnit.gameStatus = GameStatus.PLAY;

    this.gameCore.push(gameProcessUnit);
  }

  async endGame(dto: EndGameDto) {
    for (const gamePlayer of dto.gamePlayers) {
      gamePlayer.client.disconnect();
    }
    // web-app 서버로 게임결과 보내기
  }

  updateGameObject(gameKey: string, playerAction: PlayerAction) {
    const gameGroup = this.gameGroup.get(gameKey);
    const gameProcessUnit = this.gameProcessUnits.get(gameKey);

    gameProcessUnit?.updateObject(gameGroup.playerNumber, playerAction);
  }

  private generateGame(gameId: string, gameMode: GameMode): AbstractGame {
    switch (gameMode) {
      case GameMode.CLASSIC:
        return new ClassicGame(gameId);
      case GameMode.PADDLE:
        return new GoldenPongGame(gameId);
      case GameMode.SPEED:
        return new SpeedGame(gameId);
    }
  }

  private addGameProcessUnit(
    game: AbstractGame,
  ) {
    const gameProcessUnit = Builder(GameProcessUnit)
      .game(game)
      .gamePlayers([user, rivalUser])
      .gameStatus(GameStatus.STANDBY)
      .notifyEndGame(this.endGame)
      .build();

    this.gameProcessUnits.set(user.gameKey, gameProcessUnit);
    this.gameProcessUnits.set(rivalUser.gameKey, gameProcessUnit);

    return gameProcessUnit;
  }
}
