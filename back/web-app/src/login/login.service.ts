import { Injectable } from '@nestjs/common'; 
import { TwoFactorStatus } from 'src/user/twoFactor-status.enum';

@Injectable()
export class LoginService {

  isTwoFaOn(twoFactorStatus: TwoFactorStatus): boolean {
    return twoFactorStatus != TwoFactorStatus.DISABLED;
  }
}