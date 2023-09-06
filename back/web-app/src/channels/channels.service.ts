import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './channel/entity/channel.entity';
import { Repository } from 'typeorm';
import { RecentMessage } from './channel/dto/recent-message.dto';
import { MyChannels } from './channel/dto/my-channels.dto';
import { Message } from '../message/entity/message.entity';
import { Builder } from 'builder-pattern';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { UserService } from 'src/users/user/user.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		private userService: UserService,
		private messageService: MessageService,
	) {}

	async getAllChannels(): Promise<Channel[]> {
		return await this.channelRepository.find({
			select: ['id', 'name'],
			where: [
				{ mode: 'public' } ,
				{ mode: 'protected' },
      ],
		});
	}

	async getLinksRelatedChannelAndUserByUserId(userId: number): Promise<LinkChannelToUser[]>{
		const user = await this.userService.getUserByUserId(userId);
		
		return await this.linkChannelToUserRepository.find({
			where: {
				user,
			},
			relations: [
				"channel",
				"user",
			],
		});
	}

	async getMyChannels(ReqUserLinks: LinkChannelToUser[]): Promise<MyChannels[]> {
		let myChannelList: MyChannels[] = [];

		for (const ReqUserLink of ReqUserLinks) {
      const channel = ReqUserLink.channel;
			const message: Message = await this.messageService.getRecentMessageRelatedUserByChannelId(channel);
			const nicknameSendingMessage: string = message?.user.nickname ?? null;
			const messageContent: string = message?.content ?? null;
			const recentMessage: RecentMessage = Builder(RecentMessage)
			.message(messageContent)
			.nickname(nicknameSendingMessage)
			.build();

			myChannelList.push(Builder(MyChannels)
			.id(channel.id)
			.name(channel.name)
			.recentMessage(recentMessage)
			.build()
			);
    }
		return myChannelList;
	}
}
