import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  ftLogin(req: any) {
    if (!req.user) {
      return 'No user from ft'
    }
    return {
      message: 'User information from ft',
      user: req.user
    }
  }
}
