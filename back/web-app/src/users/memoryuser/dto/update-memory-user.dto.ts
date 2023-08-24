import { UserStatus } from '../../enums/user-status.enum';

export class UpdateMemoryUserDto {
  readonly userId: number;
  nickname: string;
  avatar: string;
  mail: string;
  phone: string;
  status: UserStatus;

  constructor() {
    // 클래스 생성자 내부에서 프로퍼티 플래그 설정
    Object.defineProperty(this, 'userId', {
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }
}
