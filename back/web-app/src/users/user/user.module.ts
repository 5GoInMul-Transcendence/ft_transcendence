import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OauthUser } from './entities/oauth-user.entity';
import { MemberUser } from './entities/member-user.entity';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { MemoryUserProvider } from '../memoryuser/memory-user.provider';
import { Block } from '../../block/block.entity';
import { Follower } from '../../friend/entities/follower.entity';
import { Friend } from '../../friend/entities/friend.entity';
import { UserController } from './user.controller';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { Ladder } from '../../ladder/entities/ladder.entity';
import { LadderModule } from '../../ladder/ladder.module';
import { AchievementModule } from '../../achievement/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OauthUser,
      MemberUser,
      Friend,
      Follower,
      Block,
      Achievement,
      Ladder,
    ]),
    forwardRef(() => LadderModule),
    forwardRef(() => AchievementModule),
  ],
  controllers: [UserController],
  providers: [UserService, MemoryUserService, MemoryUserProvider],
  exports: [UserService, MemoryUserService],
})
export class UserModule {}
