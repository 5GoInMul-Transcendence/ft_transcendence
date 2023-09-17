import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import sharedSession from 'socket.io-express-session';
import { MainService } from './main.service';
import { Builder } from 'builder-pattern';
import { ConnectMainDto } from './dto/connect-main.dto';
import { DisConnectMainDto } from './dto/disconnect-main.dto';
import { CheckDisconnectionByReconnectionDto } from './dto/check-disconnection-by-reconnection.dto';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';
import { CheckSessionDto } from './dto/check-session.dto';
import { EnterMatchDto } from './match/dto/enter-match.dto';
import { LeaveMatchDto } from './match/dto/leave-match.dto';
import { AcceptMatchDto } from './match/dto/accept-match.dto';
import { MatchService } from './match/match.service';
import { DisconnectMatchDto } from './match/dto/disconnect-match.dto';
import { GameMode } from '../game/enums/game-mode.enum';

@WebSocketGateway(10001, { namespace: 'main', cors: { origin: '*' } })
export class MainGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server;

  constructor(
    @Inject('SESSION_MIDDLEWARE') private sessionMiddleware: any,
    private mainService: MainService,
    private matchService: MatchService,
  ) {}

  afterInit(server: any) {
    server.use(sharedSession(this.sessionMiddleware));
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

    this.mainService.connectMain(
      Builder(ConnectMainDto).userId(session.userId).client(client).build(),
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

    this.matchService.disconnectMatch(
      Builder(DisconnectMatchDto).userId(session.userId).build(),
    );
    this.mainService.disConnectMain(
      Builder(DisConnectMainDto).userId(session.userId).client(client).build(),
    );
  }

  @SubscribeMessage('submitMatch')
  submitMatch(
    @ConnectedSocket() client: any,
    @MessageBody('gameMode') gameMode: GameMode,
  ) {
    const session = client.handshake.session;

    this.matchService.enterMatch(
      Builder(EnterMatchDto).userId(session.userId).gameMode(gameMode).build(),
    );
  }

  @SubscribeMessage('cancelMatch')
  cancelMatch(@ConnectedSocket() client: any) {
    const session = client.handshake.session;

    this.matchService.leaveMatch(
      Builder(LeaveMatchDto).userId(session.userId).build(),
    );
  }

  // 미구현 status pipe
  @SubscribeMessage('enterMatch')
  enterMatch(
    @ConnectedSocket() client: any,
    @MessageBody('status') accepted: boolean,
  ) {
    const session = client.handshake.session;

    this.matchService.acceptMatch(
      Builder(AcceptMatchDto).userId(session.userId).accepted(accepted).build(),
    );
  }
}
