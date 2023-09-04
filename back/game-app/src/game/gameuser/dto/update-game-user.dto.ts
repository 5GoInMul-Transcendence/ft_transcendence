import { GameUserStatus } from '../../enums/game-user-status.enum';

export class UpdateGameUserDto {
  gameKey: string;
  status: GameUserStatus;

  constructor() {
    // 클래스 생성자 내부에서 프로퍼티 플래그 설정
    Object.defineProperty(this, 'gameKey', {
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }
}
