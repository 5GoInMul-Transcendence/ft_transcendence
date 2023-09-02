import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel/entity/channel.entity';
import { ChannelController } from './channel/channel.controller';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { MemoryUserProvider } from 'src/users/memoryuser/memory-user.provider';
import { ChannelService } from './channel/channel.service';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      LinkChannelToUser,
      User,
    ]),
  ],
  controllers: [ChannelsController, ChannelController],
  providers: [
    ChannelsService,
    ChannelService,
  ]
})
export class ChannelsModule {}