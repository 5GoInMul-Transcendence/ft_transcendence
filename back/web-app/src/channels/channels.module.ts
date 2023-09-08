import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel/entities/channel.entity';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { LinkChannelToUser } from './channel/entities/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { UserModule } from 'src/users/user/user.module';
import { Message } from '../message/entities/message.entity';
import { MessageModule } from '../message/message.module';
import { HashModule } from 'src/common/hash/hash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      LinkChannelToUser,
      Message,
      User,
    ]),
    UserModule,
    MessageModule,
    HashModule,
  ],
  controllers: [ChannelsController, ChannelController],
  providers: [
    ChannelService,
  ]
})
export class ChannelsModule {}
