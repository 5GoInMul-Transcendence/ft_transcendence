import { Socket } from 'socket.io';

export class DisConnectMainDto {
  readonly userId: number;
  readonly client: Socket;
}
