import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entity/channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { LinkChannelToUser } from './entity/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { ChannelRole } from './enum/channel-role.enum';
import { UserService } from 'src/users/user/user.service';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@InjectRepository(LinkChannelToUser)
		private linkChannelToUserRepository: Repository<LinkChannelToUser>,
		private userService: UserService,
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
		const user = await this.userService.getUserByUserId(userId);
		const link = this.linkChannelToUserRepository.create({
			user,
			channel,
			role: ChannelRole.OWNER,
		});

		return await this.linkChannelToUserRepository.save(link);
	}
}
