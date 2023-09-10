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
import { MessageService } from 'src/message/message.service';
import { ChannelMode } from './enum/channel-mode.enum';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		private messageService: MessageService,
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

	async getAllChannels(): Promise<Channel[] | null> {
		return await this.channelRepository.find({
			select: ['id', 'name'],
		});
	}

	async getMyChannels(reqUserLinks: LinkChannelToUser[]): Promise<MyChannels[]> {
		let myChannelList: MyChannels[] = [];

		for (const link of reqUserLinks) {
      const channel = link.channel;
			const message: Message = await this.messageService.getRecentMessageRelatedUserByChannelId(channel);
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

	async getLinkByChannelAndUser(channel: Channel, user: User): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.where('link_channel_to_user.channel = :channelId', {channelId: channel.id})
		.where('link_channel_to_user.user = :userId', {userId: user.id})
		.getOne();
		// return await this.linkChannelToUserRepository.findOne({
		// 	where: {
		// 		user,
		// 		channel,
		// 	}
		// })
	}

	async getLinksRelatedChannelAndUserByUserId(userId: number): Promise<LinkChannelToUser[]>{
		const user = await this.userService.getUserByUserId(userId);
		
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.leftJoinAndSelect('link_channel_to_user.channel', 'channel')
		.leftJoinAndSelect('link_channel_to_user.user', 'user')
		.where('link_channel_to_user.user = :userId', {userId: user.id})
		.getMany();
		// return await this.linkChannelToUserRepository.find({
		// 	where: {
		// 		user,
		// 	},
		// 	relations: [
		// 		"channel",
		// 		"user",
		// 	],
		// });
	}

	async getLinkByUserIdAtPrivate(userId: number): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.leftJoinAndSelect('link_channel_to_user.channel', 'channel')
		.where('link_channel_to_user.user = :userId', {userId})
		.where('channel.mode = :mode', {mode: ChannelMode.PRIVATE})
		.getOne();
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
}
