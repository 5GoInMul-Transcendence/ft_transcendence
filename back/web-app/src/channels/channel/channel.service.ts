import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
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

	getAddChannelRes(id: number, name: string): {id: number, name: string} {
		return {
			id,
			name,
		};
	}
}
