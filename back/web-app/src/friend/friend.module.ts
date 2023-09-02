 import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserModule } from '../users/user/user.module';
import { FriendController } from './friend.controller';
import { MainUserModule } from '../main/mainuser/main-user.module';

@Module({
  imports: [UserModule, MainUserModule],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
