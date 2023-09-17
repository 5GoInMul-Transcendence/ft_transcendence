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
import { ChannelExceptionService } from './channel/exception/channel-exception.service';
import { Ban } from './channel/entities/ban.entity';
import { LinkChannelToUserService } from './channel/link-channel-to-user.service';
import { ChannelSettingService } from './channel/channel-setting.service';
import { MuteProvider } from './channel/mute/mute.provider';
import { MuteService } from './channel/mute/mute.service';

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
    ChannelExceptionService,
    LinkChannelToUserService,
    ChannelSettingService,
    MuteProvider,
    MuteService,
  ]
})
export class ChannelsModule {}
