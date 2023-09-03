import { Injectable } from '@nestjs/common';
import { Channel } from '../channel/entity/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../channel/entity/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from '../channel/dto/send-message.dto';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async sendMessage(dto: SendMessageDto): Promise<Message> {
		const { nickname, channel, content, timestamp } = dto;
		const message = this.messageRepository.create({
			nickname,
			channel,
			content,
			timestamp,
		});

		return await this.messageRepository.save(message);
	}
}
