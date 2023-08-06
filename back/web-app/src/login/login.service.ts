import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  // constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>
  // ) {}

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