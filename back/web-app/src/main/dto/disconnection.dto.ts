import { Socket } from 'socket.io';

export class DisconnectionDto {
  readonly userId: number;
  readonly client: Socket;
}
