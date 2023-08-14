import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { OauthUser } from '../entities/oauth-user.entity';
import { MemberUser } from '../entities/member-user.entity';
import { MeController } from '../me/me.controller';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { MemoryUserProvider } from '../memoryuser/memory-user.provider';
import { Block } from '../../block/block.entity';
import { Follower } from '../../friend/entities/follower.entity';
import { Friend } from '../../friend/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OauthUser,
      MemberUser,
      Friend,
      Follower,
      Block,
    ]),
  ],
  controllers: [MeController],
  providers: [UserService, MemoryUserService, MemoryUserProvider],
  exports: [UserService],
})
export class UserModule {}
