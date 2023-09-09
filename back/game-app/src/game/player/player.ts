import { Socket } from 'socket.io';
import { PlayerNumber } from './enums/player-number.enum';
import { PlayerStatus } from './enums/player-status.enum';

export class Player {
  number: PlayerNumber;
  status: PlayerStatus;
  client: Socket;
}
