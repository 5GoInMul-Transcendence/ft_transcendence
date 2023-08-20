 import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserModule } from '../users/user/user.module';
import { FriendController } from './friend.controller';

@Module({
  imports: [UserModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
