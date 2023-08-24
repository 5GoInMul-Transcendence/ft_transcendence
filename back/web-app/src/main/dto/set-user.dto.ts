import { Socket } from 'socket.io';

export class SetUserDto {
  userId: number;
  client: Socket;
}
