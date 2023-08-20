import { TwoFactorStatus } from '../users/enums/twoFactor-status.enum';

type AuthTwoFactorStatus = Exclude<TwoFactorStatus, TwoFactorStatus.DISABLED>;

export class AuthInfo {
  twoFactor: AuthTwoFactorStatus;
  modifyValue: string;
  code: string;
}
