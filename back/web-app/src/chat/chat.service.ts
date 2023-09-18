import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { ChatEvent } from './enums/chat-event.enum';
import { Builder } from 'builder-pattern';
import {
  ChatRecentMessage,
  UpdateMyChannelResDto,
} from './dto/update-my-channel-res.dto';
import { ApiResponseForm } from '../common/response/api-response-form';
import { LinkChannelToUserService } from '../channels/channel/link-channel-to-user.service';
import { CheckSessionDto } from '../main/dto/check-session.dto';
import { WsException } from '@nestjs/websockets';
import { CheckReconnectionDto } from '../main/dto/check-reconnection.dto';
import { CheckDisconnectionByReconnectionDto } from '../main/dto/check-disconnection-by-reconnection.dto';
import { Channel } from '../channels/channel/entities/channel.entity';
import { UpdateAllChannelDto } from './dto/update-all-channel.dto';
import { AddAllChannelResDto } from './dto/add-all-channel-res.dto';
import { UpdateMyChannelDto } from './dto/update-my-channel.dto';
import { AddMyChannelResDto } from './dto/add-my-channel-res.dto';
import { ChannelMode } from '../channels/channel/enum/channel-mode.enum';

@Injectable()
export class ChatService {
  private reconnection = Symbol('reconnection');
  private chatServerSocket: Server;
  private chatUsers: Map<number, Socket>;

  constructor(private linkChannelToUserService: LinkChannelToUserService) {
    this.chatUsers = new Map<number, Socket>();
  }

  init(serverSocket: Server) {
    this.chatServerSocket = serverSocket;
  }

  checkSession(dto: CheckSessionDto) {
    if (!dto.session?.userId) {
      dto.client.disconnect();
      throw new WsException('');
    }
  }

  checkReconnection(dto: CheckReconnectionDto) {
    const prevUser: Socket = this.chatUsers.get(dto.userId);

    if (prevUser) {
      prevUser.client[this.reconnection] = true;
      prevUser.disconnect();

      this.chatUsers.set(dto.userId, dto.client);

      throw new WsException('');
    }
  }

  async connectChat(userId: number, client: Socket) {
    const links =
      await this.linkChannelToUserService.getLinksRelatedChannelByUserId(
        userId,
      );

    for (const link of links) {
      client.join(link.channel.id.toString());
    }

    this.chatUsers.set(userId, client);
  }
}
