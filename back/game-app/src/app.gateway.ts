import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  handleConnection(client: any): any {
    console.log('connect');
  }

  handleDisconnect(client: any): any {
    console.log('disconnect');
  }
}
