import { Socket } from 'socket.io';
import { MainUserStatus } from '../enums/main-user-status.enum';

export class MainUser {
  userId: number;
  status: MainUserStatus;
  client: Socket;
}
