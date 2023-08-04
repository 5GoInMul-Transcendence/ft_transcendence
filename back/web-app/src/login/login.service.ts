import { Injectable } from '@nestjs/common'; 

@Injectable()
export class LoginService {
  ftLogin(req: any): {message: string; user: any} {
    const userData: {message: string; user: any;} = {
      message: "",
      user: null,
    }

    if (!req.user) {
      userData.message = 'No user from ft';
    }
    else {
      userData.message = 'User information from ft';
      userData.user = req.user;
    }
    return userData;
  }
}