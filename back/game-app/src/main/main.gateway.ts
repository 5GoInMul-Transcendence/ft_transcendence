import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from '../game/game.service';
import { CreateGameDto } from '../game/dto/create-game.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MainGateway implements OnGatewayConnection {
  constructor(private gameService: GameService) {}

  handleConnection(client: any) {}

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('createGameDto') dto: CreateGameDto,
  ) {
    this.gameService.createGame(dto);
  }
}
