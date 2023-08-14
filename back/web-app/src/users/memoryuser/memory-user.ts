import { TwoFactorStatus } from '../enums/twoFactor-status.enum';
import { UserStatus } from '../enums/user-status.enum';
export class MemoryUser {
  readonly id: number;
  nickname: string;
  avatar: string;
  mail: string;
  phone: string;
  twoFactor: TwoFactorStatus;
  status: UserStatus;
  friends: Set<number>;
  followers: Set<number>;
  blocks: Set<number>;
}
