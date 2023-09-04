import { Socket } from 'socket.io';
import { GameUserStatus } from '../enums/game-user-status.enum';

export class GameUser {
  gameKey: string;
  client: Socket;
  status: GameUserStatus;
}
