import { Socket } from 'socket.io';

export class ConnectMainDto {
  readonly userId: number;
  readonly client: Socket;
}
