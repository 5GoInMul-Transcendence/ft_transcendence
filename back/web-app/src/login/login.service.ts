import { Injectable } from '@nestjs/common'; 
import { TwoFactorStatus } from 'src/users/enums/twoFactor-status.enum';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthMailDto } from '../auth/dto/auth-mail.dto';
import { AuthPhoneDto } from '../auth/dto/auth-phone.dto';

@Injectable()
export class LoginService {
  constructor(
    private memoryUserService: MemoryUserService,
    private authService: AuthService,
  ) {}

  checkTwoFactorOn(userId: number) {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(userId).build(),
    );

    if (user.twoFactor === TwoFactorStatus.DISABLED) {
      return false;
    }

    if (user.twoFactor === TwoFactorStatus.MAIL) {
      this.authService.authMail(
        Builder(AuthMailDto).userId(user.id).mail(user.mail).build(),
      );
    }

    if (user.twoFactor === TwoFactorStatus.PHONE) {
      this.authService.authPhone(
        Builder(AuthPhoneDto).userId(user.id).phone(user.phone).build(),
      );
    }

    return true;
  }
}