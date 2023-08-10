import { Injectable } from '@nestjs/common'; 
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { TwoFactorStatus } from 'src/user/twoFactor-status.enum';

@Injectable()
export class LoginService {

  isTwoFaOn(twoFactorStatus: TwoFactorStatus): boolean {
    return twoFactorStatus != TwoFactorStatus.DISABLED;
  }

  getRedirectResource(num: RedirectResource): string {
    let resource: string;

    switch (num) {
      case RedirectResource.MAIN:
        resource = 'main';
        break;
      case RedirectResource.LOGIN:
        resource = 'login';
        break;
      default:
        resource = 'You give a invalid value!';
    }
    return resource;
  }
}