import { TwoFactorStatus } from '../../enums/twoFactor-status.enum';

export class UpdateUserDto {
  readonly userId: number;
  nickname: string;
  avatar: string;
  mail: string;
  phone: string;
  twoFactor: TwoFactorStatus;

  constructor() {
    // 클래스 생성자 내부에서 프로퍼티 플래그 설정
    Object.defineProperty(this, 'userId', {
      writable: true,
      enumerable: false,
      configurable: false,
    });
  }
}
