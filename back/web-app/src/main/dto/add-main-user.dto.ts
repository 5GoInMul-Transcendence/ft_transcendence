import { Socket } from 'socket.io';

export class AddMainUserDto {
  userId: number;
  client: Socket;
}
