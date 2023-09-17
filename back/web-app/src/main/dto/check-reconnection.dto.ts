import { Socket } from 'socket.io';

export class CheckReconnectionDto {
  userId: number;
  client: Socket;
}
