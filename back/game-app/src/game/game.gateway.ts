import {
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
        Builder(CheckReconnectionDto).gameKey(gameKey).build(),
      );
    } catch (err) {
      client.disconnect();
      return;
    }

    this.gameService.connectGame(
      Builder(ConnectGameDto).gameKey(gameKey).client(client).build(),
    );
  }

  handleDisconnect(client: Socket): any {}

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
}
