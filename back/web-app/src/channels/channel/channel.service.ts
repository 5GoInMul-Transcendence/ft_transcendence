import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository, SelectQueryBuilder, createQueryBuilder } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { LinkChannelToUser } from './entities/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { MyChannels } from './dto/my-channels.dto';
import { RecentMessage } from './dto/recent-message.dto';
import { Builder } from 'builder-pattern';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { ChannelMode } from './enum/channel-mode.enum';
import { Ban } from './entities/ban.entity';
import { ChannelRole } from './enum/channel-role.enum';
import { UpdateRoleInLinkDto } from './dto/update-role-in-link.dto';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		@InjectRepository(Ban)
		private banRepository: Repository<Ban>,
		private messageService: MessageService,
	) {}

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

	async getChannel(id: number): Promise<Channel | null> {
		return await this.channelRepository.findOne({
			where: {
				id,
			}
		});
	}

	async getFirstLinkByChannelId(channelId: number): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.where('link.channel = :channelId', {channelId})
		.getOne();
	}

	async getAllChannels(): Promise<Channel[]> {
		return await this.channelRepository
		.createQueryBuilder('channel')
		.select(['channel.id', 'channel.name'])
		.where('channel.mode = :modeA', {modeA: ChannelMode.PUBLIC})
		.orWhere('channel.mode = :modeB', {modeB: ChannelMode.PROTECTED})
		.getMany();
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

	async getCountUserInChannel(channelId: number): Promise<number> {
		return this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.where('link.channel = :channelId', {channelId})
		.getCount();
	}

	async getLinkRelatedChannelByChannelAndUser(channel: Channel, user: User): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.where('link.user_id = :userId', {userId: user.id}) // andWhere은 OR 연산이다.
		.innerJoinAndSelect('link.channel', 'channel')
		.andWhere('channel.id = :channelId', {channelId: channel.id})
		.getOne();
	}

	async getLinkByChannelAndUser(channel: Channel, user: User): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.where('link_channel_to_user.channel = :channelId', {channelId: channel.id})
		.andWhere('link_channel_to_user.user = :userId', {userId: user.id}) // andWhere은 OR 연산이다.
		.getOne();
	}

	async getLinksRelatedChannelByUserId(userId: number): Promise<LinkChannelToUser[]>{
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.leftJoinAndSelect('link_channel_to_user.channel', 'channel')
		.where('link_channel_to_user.user = :userId', {userId})
		.getMany();
	}

	async getLinkByUserIdAtPrivate(userId: number): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link_channel_to_user')
		.leftJoinAndSelect('link_channel_to_user.channel', 'channel')
		.where('link_channel_to_user.user = :userId', {userId})
		.andWhere('channel.mode = :mode', {mode: ChannelMode.PRIVATE})
		.getOne();
	}

	async getLinkRoleIsAdmin(channelId: number): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.where('link.channel = :channelId', {channelId})
		.andWhere('link.role = :role', {role: ChannelRole.ADMIN})
		.getOne();
	}

	async getCreateDmChannelRes(userIdA: number, userIdB: number): Promise<LinkChannelToUser[]> {
		const subQuery: SelectQueryBuilder<LinkChannelToUser> = this.linkChannelToUserRepository
		.createQueryBuilder('linkA')
		.select('linkA.channel')
		.innerJoin('linkA.channel', 'channelA', 'channelA.mode = :modeA', {modeA: ChannelMode.DM})
		.where('linkA.user = :userIdA', {userIdA})
		const mainQuery: SelectQueryBuilder<LinkChannelToUser> = this.linkChannelToUserRepository
		.createQueryBuilder('linkB')
		.select('linkB.channel')
		.innerJoinAndSelect('linkB.channel', 'channel', 'channel.mode = :modeB', {modeB: ChannelMode.DM})
		.where('linkB.user = :userIdB', {userIdB})
		.andWhere(`linkB.channel In (${subQuery.getQuery()})`);
		const links: any[] = await mainQuery
		.setParameters(subQuery.getParameters())
		.getRawMany();

		return links;
	}

	async getBanList(channelId: number): Promise<Ban | null> {
		return await this.banRepository.createQueryBuilder('ban')
		.where('ban.channel = :channelId', {channelId})
		.getOne();
	}

	updateRoleInLink(link: LinkChannelToUser, dto: Partial<UpdateRoleInLinkDto>): void {
		this.linkChannelToUserRepository.update(link.id, {...dto});
	}

	/**
	 * 
	 * @param link: Goal to delete a user
	 */
	async deleteLink(link: LinkChannelToUser): Promise<void> {
		await this.linkChannelToUserRepository.remove(link);
	}

	async deleteChannel(channel: Channel): Promise<void> {
		await this.channelRepository.remove(channel);
	}

	async deleteBanList(channelId: number): Promise<void> {
		const ban: Ban | null = await this.getBanList(channelId);

		if (!ban)
			return;
		await this.banRepository.remove(ban);
	}
}
