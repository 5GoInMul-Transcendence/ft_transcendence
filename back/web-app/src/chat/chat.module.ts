import { forwardRef, Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { SessionModule } from '../session/session.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [SessionModule, forwardRef(() => ChannelsModule), MessageModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
