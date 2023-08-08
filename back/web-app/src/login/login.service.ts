import { Injectable } from '@nestjs/common'; 
import { TwoFactorStatus } from 'src/user/twoFactor-status.enum';

@Injectable()
export class LoginService {

  isTwoFaOn(twoFactorStatus: TwoFactorStatus): boolean {
    return twoFactorStatus != TwoFactorStatus.DISABLED;
  }

  ftLogin(req: any): {message: string; user: any} {
    const userData: {message: string; user: any;} = {
      message: "",
      user: null,
    }

    if (!req || !req.user) {
      userData.message = 'No user from ft';
    }
    else {
      userData.message = 'User information from ft';
      userData.user = req.user;
    }
    return userData;
  }
}