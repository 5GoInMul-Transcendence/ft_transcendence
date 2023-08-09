import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SignupOauth } from './signup-oauth.entity';
import { SignupMember } from './signup-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SignupOauth,
      SignupMember,
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
