import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel/entity/channel.entity';
import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { UserModule } from 'src/users/user/user.module';
import { Message } from './channel/entity/message.entity';
import { HashService } from 'src/common/hash/hash.service';
import { MessageService } from './message/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      LinkChannelToUser,
      Message,
      User,
    ]),
    UserModule,
  ],
  controllers: [ChannelsController, ChannelController],
  providers: [
    ChannelsService,
    ChannelService,
    HashService,
    MessageService,
  ]
})
export class ChannelsModule {}
