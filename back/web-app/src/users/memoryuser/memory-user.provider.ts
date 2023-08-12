import { Injectable, OnModuleInit } from '@nestjs/common';
import { MemoryUser } from './memory-user';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from '../../friend/entities/friend.entity';
import { Follower } from '../../friend/entities/follower.entity';
import { Block } from '../../block/block.entity';
import { plainToClass } from 'class-transformer';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class MemoryUserProvider
  extends Map<number, MemoryUser>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.constructMemoryUsers();
  }

  private async constructMemoryUsers() {
    const users: User[] = await this.userRepository.find();
    const friends: Friend[] = await this.friendRepository.find();
    const followers: Follower[] = await this.followerRepository.find();
    const blocks: Block[] = await this.blockRepository.find();

    const userFriends: Map<number, Set<number>> = new Map(
      friends.map((friend) => [friend.userId, new Set(friend.friends)]),
    );
    const userFollowers: Map<number, Set<number>> = new Map(
      followers.map((follower) => [
        follower.userId,
        new Set(follower.followers),
      ]),
    );
    const userBlocks: Map<number, Set<number>> = new Map(
      blocks.map((block) => [block.userId, new Set(block.blocks)]),
    );

    const memoryUserEntries: [number, MemoryUser][] = users.map((user) => {
      const memoryUser = plainToClass(MemoryUser, user);
      memoryUser.status = UserStatus.OFFLIEN;
      memoryUser.followers = userFriends.get(user.id);
      memoryUser.friends = userFollowers.get(user.id);
      memoryUser.blocks = userBlocks.get(user.id);
      return [user.id, memoryUser];
    });

    for (const [id, memoryUser] of memoryUserEntries) {
      this.set(id, memoryUser);
    }
  }
}
