import { MainUserStatus } from '../enums/main-user-status.enum';
import { Socket } from 'socket.io';

export class UpdateMainUserDto {
  userId: number;
  status: MainUserStatus;
  client: Socket;

  constructor() {
    // 클래스 생성자 내부에서 프로퍼티 플래그 설정
    Object.defineProperty(this, 'userId', {
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }
}
