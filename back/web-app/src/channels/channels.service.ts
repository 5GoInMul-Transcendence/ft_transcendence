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

	async getAllChannels(): Promise<Channel[] | null> {
		return await this.channelRepository.find({
			select: ['id', 'name'],
		});
	}

	async getLinksRelatedChannelAndUserByUserId(userId: number): Promise<LinkChannelToUser[] | null>{
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

	async getMyChannels(links: LinkChannelToUser[]): Promise<MyChannels[] | null> {
		let myChannelList: MyChannels[] = [];

		for (const link of links) {
      const channel = link.channel;
			const channelId: number = channel.id;
			const channelName = channel.name;
			const message: Message = await this.messageService.getRecentMessageByChannelId(channel);
			const userId = message?.userId;
			const nickname = userId ? link.user.nickname : null;
			const recentMessage: RecentMessage = Builder(RecentMessage)
			.message(message?.content ?? null)
			.nickname(nickname)
			.build();

			myChannelList.push(Builder(MyChannels)
			.id(channelId)
			.name(channelName)
			.recentMessage(recentMessage)
			.build()
			);
    }
		return myChannelList;
	}
}
