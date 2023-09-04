import { Socket } from 'socket.io';

export class ConnectGameDto {
  gameKey: string;
  client: Socket;
}
