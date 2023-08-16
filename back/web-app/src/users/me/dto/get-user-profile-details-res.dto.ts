import { TwoFactorStatus } from '../../enums/twoFactor-status.enum';

export class GetUserProfileDetailsResDto {
  readonly id: number;
  readonly nickname: string;
  readonly avatar: string;
  readonly mail: string;
  readonly phone: string;
  readonly twoFactor: TwoFactorStatus;
}
