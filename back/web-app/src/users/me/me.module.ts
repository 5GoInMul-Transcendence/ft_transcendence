import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MeController } from './me.controller';
import { ImageModule } from '../../common/image/image.module';
import { FriendModule } from '../../friend/friend.module';

@Module({
  imports: [UserModule, FriendModule, ImageModule],
  controllers: [MeController],
})
export class MeModule {}
