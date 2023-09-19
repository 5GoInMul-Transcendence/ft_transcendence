import { forwardRef, Module } from '@nestjs/common';
import { ChannelsModule } from '../channels/channels.module';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule, forwardRef(() => ChannelsModule)],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
