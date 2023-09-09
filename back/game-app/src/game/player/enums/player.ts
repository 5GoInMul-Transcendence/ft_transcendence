import { PlayerStatus } from './player-status.enum';
import { Socket } from 'socket.io';

export class Player {
  status: PlayerStatus;
  client: Socket;
}
