import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UserModule } from 'src/users/user/user.module';
import { HashService } from 'src/common/hash/hash.service';

@Module({
  imports: [UserModule], // Use to UserService
  controllers: [SignupController],
  providers: [
    SignupService,
    HashService,
  ],
  exports: [SignupService],
})
export class SignupModule {}
