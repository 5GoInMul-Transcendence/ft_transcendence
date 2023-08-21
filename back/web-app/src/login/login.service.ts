import { Injectable } from '@nestjs/common'; 
import { TwoFactorStatus } from 'src/users/enums/twoFactor-status.enum';

@Injectable()
export class LoginService {

  isTwoFaOn(twoFactorStatus: TwoFactorStatus): boolean {
    return twoFactorStatus != TwoFactorStatus.DISABLED;
  }
}