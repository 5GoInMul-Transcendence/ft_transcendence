import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entity/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from '../channels/channel/dto/send-message.dto';
import { Channel } from '../channels/channel/entity/channel.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async sendMessage(dto: SendMessageDto): Promise<Message> {
		const { user, channel, content, timestamp } = dto;
		const message = this.messageRepository.create({
			user,
			channel,
			content,
			timestamp,
		});

		return await this.messageRepository.save(message);
	}

	async getRecentMessageRelatedUserByChannelId(channel: Channel): Promise<Message | null> {
		return await this.messageRepository.findOne({
			where: {
				channel,
			},
			order: {
				timestamp: 'DESC',
			},
			relations: [
				'user'
			],
		});
	}
}
