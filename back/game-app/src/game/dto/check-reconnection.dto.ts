import { Socket } from 'socket.io';

export class CheckReconnectionDto {
  readonly client: Socket;
  readonly gameKey: string;
}
