import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { OauthUser } from '../entities/oauth-user.entity';
import { MemberUser } from '../entities/member-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OauthUser,
      MemberUser,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
