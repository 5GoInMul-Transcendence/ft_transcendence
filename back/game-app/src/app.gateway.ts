import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game/game.service';
import { CreateGameDto } from './game/dto/create-game.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameService: GameService) {}

  handleConnection(client: any, ...args: any[]): any {}

  handleDisconnect(client: any): any {
    console.log('disconnect');
  }

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('createGameDto') dto: CreateGameDto,
  ) {
    this.gameService.createGame(dto);
  }
}
