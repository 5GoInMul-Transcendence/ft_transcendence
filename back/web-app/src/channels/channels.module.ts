import { forwardRef, Module } from '@nestjs/common';
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
import { LinkChannelToUserService } from './channel/link-channel-to-user.service';
import { ChatModule } from '../chat/chat.module';
import { ChannelSettingService } from './channel/channel-setting.service';
import { MuteProvider } from './channel/user-setting/mute.provider';
import { UserSettingService } from './channel/user-setting/user-setting.service';
import { BanProvider } from './channel/user-setting/ban.provider';
import { BlockModule } from '../block/block.module';

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
    BlockModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [ChannelsController, ChannelController],
  providers: [
    ChannelService,
    ChannelExceptionService,
    LinkChannelToUserService,
    ChannelSettingService,
    MuteProvider,
    BanProvider,
    UserSettingService,
  ],
  exports: [LinkChannelToUserService],
})
export class ChannelsModule {}
