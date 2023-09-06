import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { Builder } from 'builder-pattern';
import { ConnectGameDto } from './dto/connect-game.dto';
import { ReadyGameDto } from './dto/ready-game.dto';
import { StartGameDto } from './dto/start-game-dto';
import { CheckGameKeyDto } from './dto/check-game-key.dto';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';
import { CheckDisconnectByReconnectionDto } from './dto/check-disconnect-by-reconnection.dto';
import { PlayerAction } from './mode/enums/player-action.enum';
import { DisconnectGameDto } from './dto/disconnect-game-dto';

@WebSocketGateway(10003, { namespace: 'game', cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  handleConnection(client: Socket): any {
    const { gameKey } = client.handshake.auth;
    try {
      this.gameService.checkGameKey(
        Builder(CheckGameKeyDto).gameKey(gameKey).build(),
      );
      this.gameService.checkReconnection(
        Builder(CheckReconnectionDto).client(client).gameKey(gameKey).build(),
      );
    } catch (err) {
      client.disconnect();
      return;
    }
    this.gameService.connectGame(
      Builder(ConnectGameDto).gameKey(gameKey).client(client).build(),
    );
  }

  handleDisconnect(client: Socket): any {
    const { gameKey } = client.handshake.auth;

    try {
      this.gameService.checkDisconnectByReconnection(
        Builder(CheckDisconnectByReconnectionDto).client(client).build(),
      );
    } catch (err) {
      return;
    }

    this.gameService.disconnectGame(
      Builder(DisconnectGameDto).gameKey(gameKey).build(),
    );
  }

  @SubscribeMessage('readyGame')
  readyGame(client: any) {
    const { gameKey } = client.handshake.auth;

    this.gameService.readyGame(Builder(ReadyGameDto).gameKey(gameKey).build());
  }

  @SubscribeMessage('startGame')
  startGame(client: any) {
    const { gameKey } = client.handshake.auth;

    this.gameService.startGame(Builder(StartGameDto).gameKey(gameKey).build());
  }

  @SubscribeMessage('updatePaddle')
  updatePaddle(@ConnectedSocket() client: any, @MessageBody('paddle') playerAction: PlayerAction) {
    const { gameKey } = client.handshake.auth;

    this.gameService.updateGameObject(gameKey, playerAction);
  }
}
