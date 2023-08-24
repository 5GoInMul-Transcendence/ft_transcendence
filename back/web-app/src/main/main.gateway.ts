import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import sharedSession from 'socket.io-express-session';
import { MainService } from './main.service';
import { Builder } from 'builder-pattern';
import { ConnectionDto } from './dto/connection.dto';
import { DisconnectionDto } from './dto/disconnection.dto';
import { CheckDisconnectionByReconnectionDto } from './dto/check-disconnection-by-reconnection.dto';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';
import { CheckSessionDto } from './dto/check-session.dto';

@WebSocketGateway(10001, { namespace: 'main', cors: { origin: '*' } })
export class MainGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  constructor(
    @Inject('SESSION_MIDDLEWARE') private sessionMiddleWare: any,
    private mainService: MainService,
  ) {}

  afterInit(server: any) {
    server.use(sharedSession(this.sessionMiddleWare, { autoSave: true }));
  }

  handleConnection(client: any) {
    const session = client.handshake.session;

    try {
      this.mainService.checkSession(
        Builder(CheckSessionDto).session(session).client(client).build(),
      );

      this.mainService.checkReconnection(
        Builder(CheckReconnectionDto)
          .userId(session.userId)
          .client(client)
          .build(),
      );
    } catch (err) {
      return;
    }

    this.mainService.connection(
      Builder(ConnectionDto).userId(session.userId).client(client).build(),
    );
  }

  handleDisconnect(client: any) {
    const session = client.handshake.session;

    try {
      this.mainService.checkDisconnectionByReconnection(
        Builder(CheckDisconnectionByReconnectionDto).client(client).build(),
      );
    } catch (err) {
      return;
    }

    this.mainService.disConnection(
      Builder(DisconnectionDto)
        .userId(session.userId)
        .client(client)
        .build(),
    );
  }
}
