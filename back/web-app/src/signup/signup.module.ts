import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UserModule } from 'src/users/user/user.module';

@Module({
  imports: [UserModule], // Use to UserService
  controllers: [SignupController],
  providers: [SignupService],
  exports: [SignupService],
})
export class SignupModule {}
