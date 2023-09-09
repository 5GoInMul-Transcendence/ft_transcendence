import {
   ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GameMode } from './game/enums/game-mode.enum';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  handleConnection(client: any): any {
    console.log('connect');
  }

  handleDisconnect(client: any): any {
    console.log('disconnect');
  }

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client,
    @MessageBody('gameMode') gameMode: GameMode,
  ) {
    console.log(gameMode);
  }
}
