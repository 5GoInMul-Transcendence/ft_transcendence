import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { LinkChannelToUser } from './entities/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { UserService } from 'src/users/user/user.service';
import { MyChannels } from './dto/my-channels.dto';
import { RecentMessage } from './dto/recent-message.dto';
import { Builder } from 'builder-pattern';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		@InjectRepository(Message)
		private messageRepositoy: Repository<Message>,
		private userService: UserService,
	) {}

	isUserInChannel(link: LinkChannelToUser): boolean {
		return link !== null;
	}

	async getChannel(id: number): Promise<Channel | null> {
		return await this.channelRepository.findOne({
			where: {
				id,
			}
		});
	}

	async getLinkByChannelAndUser(channel: Channel, user: User): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository.findOne({
			where: {
				user,
				channel,
			}
		})
	}

	async createChannel(dto: CreateChannelReqDto): Promise<Channel> {
		const {name, mode, password} = dto;
		const createdChannel = this.channelRepository.create({
			name,
			mode,
			password,
		});

		return await this.channelRepository.save(createdChannel);
	}

	async createLinkChannelToUser(dto: CreateLinkChannelToUserReqDto)
	: Promise<LinkChannelToUser> {
		const { user, channel, role } = dto;
		const link = this.linkChannelToUserRepository.create({
			user,
			channel,
			role,
		});

		return await this.linkChannelToUserRepository.save(link);
	}

	async getAllChannels(): Promise<Channel[] | null> {
		return await this.channelRepository.find({
			select: ['id', 'name'],
		});
	}

	async getMyChannels(reqUserLinks: LinkChannelToUser[]): Promise<MyChannels[] | null> {
		let myChannelList: MyChannels[] = [];

		for (const link of reqUserLinks) {
      const channel = link.channel;
			const message: Message = await this.getRecentMessageRelatedUserByChannelId(channel);
			const nicknameSendingMessage: string = message?.user.nickname;
			const recentMessage: RecentMessage = Builder(RecentMessage)
			.message(message?.content ?? null)
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

	private async getRecentMessageRelatedUserByChannelId(channel: Channel): Promise<Message | null> {
		return await this.messageRepositoy.findOne({
			where: {
				channel,
			},
			order: {
				timestamp: 'DESC',
			},
			relations: [
				'user',
			]
		});
	}
}
