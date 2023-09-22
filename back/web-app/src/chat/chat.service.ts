import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
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
import { DeleteChannelResDto } from './dto/delete-channel-res.dto';
import { RecentMessage } from 'src/channels/channel/dto/recent-message.dto';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ChatService {
  private reconnection = Symbol('reconnection');
  private chatServerSocket: Server;
  private chatUsers: Map<number, Socket>;

  constructor(
    private linkChannelToUserService: LinkChannelToUserService,
    private messageService: MessageService,
    ) {
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

  checkDisconnectionByReconnection(dto: CheckDisconnectionByReconnectionDto) {
    if (dto.client[this.reconnection]) {
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

  disconnectChat(userId: number) {
    this.chatUsers.delete(userId);
  }

  async enterChannel(userId: number, channel: Channel) {
    const client = this.chatUsers.get(userId);

    if (client) {
      client.join(channel.id.toString());

      this.updateMyChannel(
        Builder(UpdateMyChannelDto)
          .event(ChatEvent.AddMyChannel)
          .userId(userId)
          .channel(channel)
          .build(),
      );
    }

    if (
      channel.mode !== ChannelMode.PUBLIC &&
      channel.mode !== ChannelMode.PROTECTED
    ) {
      return;
    }

    const countUserInChannel =
      await this.linkChannelToUserService.getCountLinkInChannel(channel.id);

    if (countUserInChannel == 1) {
      this.updateAllChannel(
        Builder(UpdateAllChannelDto)
          .event(ChatEvent.AddAllChannel)
          .channel(channel)
          .build(),
      );
    }
  }

  async leaveChannel(userId: number, channel: Channel) {
    const client = this.chatUsers.get(userId);

    if (client) {
      client.leave(channel.id.toString());

      this.updateMyChannel(
        Builder(UpdateMyChannelDto)
          .event(ChatEvent.DeleteMyChannel)
          .userId(userId)
          .channel(channel)
          .build(),
      );
    }

    if (
      channel.mode !== ChannelMode.PUBLIC &&
      channel.mode !== ChannelMode.PROTECTED
    ) {
      return;
    }

    const countUserInChannel =
      await this.linkChannelToUserService.getCountLinkInChannel(channel.id);

    if (countUserInChannel == 0) {
      this.updateAllChannel(
        Builder(UpdateAllChannelDto)
          .event(ChatEvent.DeleteAllChannel)
          .channel(channel)
          .build(),
      );
    }
  }

  sendMessage(message: Message) {
    const { id, user, channel, content } = message;

    const resDto = Builder(UpdateMyChannelResDto)
      .id(channel.id)
      .recentMessage(
        Builder(ChatRecentMessage)
          .id(id)
          .nickname(user.nickname)
          .content(content)
          .build(),
      )
      .build();

    this.chatServerSocket
      .to(channel.id.toString())
      .emit(ChatEvent.UpdateMyChannel, ApiResponseForm.ok(resDto));
  }

  updateAllChannel(dto: UpdateAllChannelDto) {
    const { event, channel } = dto;

    switch (event) {
      case ChatEvent.AddAllChannel:
        this.chatServerSocket.emit(
          event,
          ApiResponseForm.ok(
            Builder(AddAllChannelResDto)
              .id(channel.id)
              .name(channel.name)
              .build(),
          ),
        );
        break;
      case ChatEvent.DeleteAllChannel:
        this.chatServerSocket.emit(
          event,
          ApiResponseForm.ok(
            Builder(DeleteChannelResDto).id(channel.id).build(),
          ),
        );
        break;
    }
  }

  async updateMyChannel(dto: UpdateMyChannelDto) {
    const { userId, event, channel } = dto;
    let message: Message;
    const client = this.chatUsers.get(userId);

    if (!client) {
      return;
    }

    switch (event) {
      case ChatEvent.AddMyChannel:
        message = await this.messageService.getRecentMessageRelatedUserByChannelId(channel);
        client.emit(
          event,
          ApiResponseForm.ok(
            Builder(AddMyChannelResDto)
              .id(channel.id)
              .name(channel.name)
              .recentMessage(Builder(RecentMessage)
              .id(message?.id ?? -1)
              .nickname(message?.user.nickname ?? '')
              .content(message?.content ?? '')
              .build())
              .build(),
          ),
        );
        break;
      case ChatEvent.DeleteMyChannel:
        client.emit(
          event,
          ApiResponseForm.ok(
            Builder(DeleteChannelResDto).id(channel.id).build(),
          ),
        );
    }
  }
}
