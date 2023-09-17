import { Socket } from 'socket.io';

export class CheckDisconnectionByReconnectionDto {
  client: Socket;
}
