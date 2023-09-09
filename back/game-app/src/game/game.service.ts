import { Injectable } from '@nestjs/common';
import { GameMode } from './mode/enums/game-mode.enum';
import { AbstractGame } from './mode/game.abstract';
import { ClassicGame } from './mode/classic-game';
import { GoldenPongGame } from './mode/golden-pong-game';
import { SpeedGame } from './mode/speed-game';
import { Builder } from 'builder-pattern';
import { CreateGameDto } from './dto/create-game.dto';
import { GameGroup } from './game-group';
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
import { Player } from './player/enums/player';
import { PlayerStatus } from './player/enums/player-status.enum';
import { PlayerNumber } from './player/enums/player-number.enum';

@Injectable()
export class GameService {
  private reconnection = Symbol('reconnection');
  private gameGroup: Map<string, GameGroup>;
  private gameProcessUnits: Map<string, GameProcessUnit>;

  constructor(private gameCore: GameCore) {
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
    const { player } = this.gameGroup.get(dto.gameKey);

    if (player.status >= PlayerStatus.CONNECT) {
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
    const { player } = this.gameGroup.get(dto.gameKey);

    player.status = PlayerStatus.CONNECT;
    player.client = dto.client;
  }

  disconnectGame(dto: DisconnectGameDto) {
    const gameGroup = this.gameGroup.get(dto.gameKey);

    this.gameGroup.delete(dto.gameKey);
    this.gameProcessUnits.delete(dto.gameKey);
  }

  createGame(dto: CreateGameDto) {
    const game = this.generateGame(dto.gameId, dto.gameMode);

    const p1Player = Builder(Player)
      .status(PlayerStatus.CREATED)
      .client(null)
      .build();
    const p2Player = Builder(Player)
      .status(PlayerStatus.CREATED)
      .client(null)
      .build();

    this.gameGroup.set(
      dto.p1GameKey,
      Builder(GameGroup)
        .game(game)
        .player(p1Player)
        .rivalPlayer(p2Player)
        .build(),
    );
    this.gameGroup.set(
      dto.p2GameKey,
      Builder(GameGroup)
        .game(game)
        .player(p2Player)
        .rivalPlayer(p1Player)
        .build(),
    );
  }

  readyGame(dto: ReadyGameDto) {
    const { game, player, rivalPlayer } = this.gameGroup.get(dto.gameKey);

    if (game.status != GameStatus.CREATED) {
      return;
    }

    player.status = PlayerStatus.GAME_READY;

    if (rivalPlayer.status != PlayerStatus.GAME_READY) {
      return;
    }

    const player1 = player.number == PlayerNumber.P1 ? player : rivalPlayer;
    const player2 = player.number == PlayerNumber.P2 ? player : rivalPlayer;
    this.addGameProcessUnit(game, player1, player2);

    game.status = GameStatus.STANDBY;
    player1.client.emit('infoGame', Builder(InfoGameRes).status(game.status).build());
    player2.client.emit('infoGame', Builder(InfoGameRes).status(game.status).build());
  }

  startGame(dto: StartGameDto) {
    const { game, player, rivalPlayer } = this.gameGroup.get(dto.gameKey);

    if (game.status != GameStatus.STANDBY) {
      return;
    }

    player.status = PlayerStatus.GAME_START;

    if (rivalPlayer.status != PlayerStatus.GAME_START) {
      return;
    }

    game.status = GameStatus.START;
    player.client.emit('infoGame', Builder(InfoGameRes).status(game.status).build());
    rivalPlayer.client.emit('infoGame', Builder(InfoGameRes).status(game.status).build());

    this.gameCore.push(this.gameProcessUnits.get(game.id));
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
    player1: Player,
    player2: Player,
  ) {
    const gameProcessUnit = Builder(GameProcessUnit)
      .game(game)
      .players([player1, player2])
      .build();

    this.gameProcessUnits.set(game.gameId, gameProcessUnit);
  }
}
