import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import sharedSession from 'socket.io-express-session';
import { Builder } from 'builder-pattern';
import { CheckSessionDto } from '../main/dto/check-session.dto';
import { CheckReconnectionDto } from '../main/dto/check-reconnection.dto';
import { CheckDisconnectionByReconnectionDto } from '../main/dto/check-disconnection-by-reconnection.dto';
import { Server } from 'socket.io';

@WebSocketGateway(10002, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('SESSION_MIDDLEWARE') private sessionMiddleware: any,
  ) {}

  afterInit(server: Server) {
    server.use(sharedSession(this.sessionMiddleware));
  }

  handleConnection(client: any) {

  }

  handleDisconnect(client: any): any {

  }
}
