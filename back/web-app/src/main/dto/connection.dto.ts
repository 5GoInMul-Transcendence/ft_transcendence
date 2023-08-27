import { Socket } from 'socket.io';

export class ConnectionDto {
  readonly userId: number;
  readonly client: Socket;
}
