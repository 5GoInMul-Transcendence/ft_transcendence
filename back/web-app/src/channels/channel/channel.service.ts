import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { LinkChannelToUser } from './entity/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { ChannelRole } from './enum/channel-role.enum';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
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

	async createLinkChannelToUser(dto: CreateLinkChannelToUserReqDto): Promise<LinkChannelToUser> {
		const { userId, channel } = dto;
		const user = await this.userRepository.findOne({
			where: {id: userId},
		})
		const link = this.linkChannelToUserRepository.create({
			userId: user,
			channelId: channel,
			role: ChannelRole.OWNER,
		});

		return await this.linkChannelToUserRepository.save(link);
	}

	getAddChannelRes(id: number, name: string): {id: number, name: string} {
		return {
			id,
			name,
		};
	}
}
