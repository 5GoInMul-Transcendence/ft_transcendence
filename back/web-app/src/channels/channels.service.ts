import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './channel/entity/channel.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user/entities/user.entity';
import { RecentMessage } from './channel/dto/recent-message.dto';
import { MyChannels } from './channel/dto/my-channels.dto';
import { Message } from './channel/entity/message.entity';
import { Builder } from 'builder-pattern';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { UserService } from 'src/users/user/user.service';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(Message)
		private messageRepositoy: Repository<Message>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		private userService: UserService,
	) {}

	async getAllChannels(): Promise<Channel[]> {
		return await this.channelRepository.find({
			select: ['id', 'name'],
		});
	}

	async getLinksByUserId(userId: number): Promise<LinkChannelToUser[]>{
		const user = await this.userService.getUserByUserId(userId);
		
		return await this.linkChannelToUserRepository.find({
			where: {
				user,
			},
			relations: ["channel"],
		});
	}

	private async getRecentMessageByChannelId(channel: Channel): Promise<Message | null> {
		return await this.messageRepositoy.findOne({
			where: {
				channel,
			},
			order: {
				timestamp: 'DESC',
			}
		});
	}

	async getMyChannels(links: LinkChannelToUser[]): Promise<MyChannels[]> {
		let myChannelList: MyChannels[] = [];

		for (const link of links) {
      const channel = link.channel;
			const channelId: number = channel.id;
			const channelName = channel.name;
			const message: Message = await this.getRecentMessageByChannelId(channel);
			const recentMessage: RecentMessage = Builder(RecentMessage)
			.message(message?.content ?? null)
			.nickname(message?.nickname ?? null)
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
