import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { Builder } from 'builder-pattern';
import { ConnectGameDto } from './dto/connect-game.dto';

@WebSocketGateway(10003, { namespace: 'game', cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  handleConnection(client: Socket): any {
    const { gameKey } = client.handshake.auth;

    try {
      this.gameService.checkGameKey(gameKey);
      this.gameService.checkReconnection(gameKey);
    } catch (err) {
      client.disconnect();
      return;
    }

    this.gameService.connectGame(
      Builder(ConnectGameDto).gameKey(gameKey).client(client).build(),
    );
  }

  handleDisconnect(client: Socket): any {}
}
