import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UserModule } from 'src/users/user/user.module';
import { HashModule } from 'src/common/hash/hash.module';

@Module({
  imports: [
    UserModule,
    HashModule,
  ],
  controllers: [SignupController],
  providers: [
    SignupService,
  ],
  exports: [SignupService],
})
export class SignupModule {}
