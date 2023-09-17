import { TwoFactorStatus } from '../../enums/twoFactor-status.enum';

export class UpdateTwofactorReqDto {
  readonly twofactor: TwoFactorStatus;
}
