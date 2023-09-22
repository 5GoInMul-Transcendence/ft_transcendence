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
import { MainService } from './main.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MainGateway implements OnGatewayConnection {
  constructor(
    private gameService: GameService,
    private mainService: MainService,
  ) {}

  handleConnection(client: any) {
    this.mainService.connectMain(client);
  }

  @SubscribeMessage('createGame')
  createGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateGameDto,
  ) {
    this.gameService.createGame(dto);
  }
}
