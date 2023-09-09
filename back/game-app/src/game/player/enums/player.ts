import { PlayerStatus } from './player-status.enum';
import { Socket } from 'socket.io';
import { PlayerNumber } from './player-number.enum';

export class Player {
  number: PlayerNumber;
  status: PlayerStatus;
  client: Socket;
}
