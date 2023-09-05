import { Socket } from 'socket.io';

export class CheckDisconnectByReconnectionDto {
  readonly client: Socket;
}
