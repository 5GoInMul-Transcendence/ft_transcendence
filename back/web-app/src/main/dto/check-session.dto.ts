import { Socket } from 'socket.io';

export class CheckSessionDto {
  session: any;
  client: Socket;
}
