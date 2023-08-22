import { TwoFactorStatus } from '../../enums/twoFactor-status.enum';

export class CheckAvailableTwofactorDto {
  readonly userId: number;
  readonly twoFactor: TwoFactorStatus;
}
