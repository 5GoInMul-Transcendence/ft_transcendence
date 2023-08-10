import { Injectable } from '@nestjs/common'; 
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { TwoFactorStatus } from 'src/user/twoFactor-status.enum';

@Injectable()
export class LoginService {

  isTwoFaOn(twoFactorStatus: TwoFactorStatus): boolean {
    return twoFactorStatus != TwoFactorStatus.DISABLED;
  }

  // 해당 서비스는 로그인에서만 사용할 것이 아니기 때문에 다른 곳으로 옮겨질 예정
  getRedirectResource(num: RedirectResource): string {
    let resource: string;

    switch (num) {
      case RedirectResource.MAIN:
        resource = RedirectResource.MAIN;
        break;
      case RedirectResource.LOGIN:
        resource = RedirectResource.LOGIN;
        break;
      default:
        resource = 'You give a invalid value!';
    }
    return resource;
  }
}