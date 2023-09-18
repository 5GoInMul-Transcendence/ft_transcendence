import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LinkChannelToUser } from './entities/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { ChannelMode } from './enum/channel-mode.enum';
import { ChannelRole } from './enum/channel-role.enum';
import { UpdateRoleInLinkDto } from './dto/update-role-in-link.dto';

@Injectable()
export class LinkChannelToUserService {
	constructor(
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
	) {}

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

	async getFirstLinkByChannelId(channelId: number): Promise<LinkChannelToUser | null> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.where('link.channel = :channelId', {channelId})
		.getOne();
	}

	async getCountLinkInChannel(channelId: number): Promise<number> {
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

	async getLinksRelatedUserByChannelId(channelId: number): Promise<LinkChannelToUser[]> {
		return await this.linkChannelToUserRepository
		.createQueryBuilder('link')
		.innerJoinAndSelect('link.user', 'user', 'link.channel = :channelId', {channelId})
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
}
