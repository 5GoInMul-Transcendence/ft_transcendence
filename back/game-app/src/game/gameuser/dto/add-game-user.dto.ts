import { Socket } from 'socket.io';

export class AddGameUserDto {
  gameKey: string;
  client: Socket;
}
