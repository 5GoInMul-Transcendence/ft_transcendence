import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  getHello(): string {
    throw new Error('Method not implemented.');
  }
  
  ftLogin(req: any) {
    if (!req.user) {
      return 'No user from ft'
    }

    // console.log(req);
    return {
      message: 'User information from ft',
      user: req.user
    }
  }
}
