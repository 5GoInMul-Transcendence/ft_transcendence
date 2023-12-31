import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MeController } from './me.controller';
import { ImageModule } from '../../common/image/image.module';
import { FriendModule } from '../../friend/friend.module';
import { LadderModule } from '../../ladder/ladder.module';
import { AchievementModule } from '../../achievement/achievement.module';

@Module({
  imports: [
    UserModule,
    FriendModule,
    ImageModule,
    LadderModule,
    AchievementModule,
  ],
  controllers: [MeController],
})
export class MeModule {}
