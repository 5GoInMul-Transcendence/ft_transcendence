import { Injectable } from '@nestjs/common';
import { Channel } from '../channel/entity/channel.entity';
import { Repository } from 'typeorm';
import { Message } from '../channel/entity/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from '../channel/dto/send-message.dto';
import { RecentMessageAtEnter } from '../channel/dto/recent-message-at-enter.dto';
import { Builder } from 'builder-pattern';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async sendMessage(dto: SendMessageDto): Promise<Message> {
		const { userId, channel, content, timestamp } = dto;
		const message = this.messageRepository.create({
			userId,
			channel,
			content,
			timestamp,
		});

		return await this.messageRepository.save(message);
	}

	async getMessages(channel: Channel): Promise<RecentMessageAtEnter[]> {
		const maxMessagesCount = 50;
		const messages = await this.messageRepository
		.createQueryBuilder('message')
		.orderBy('message.timestamp', 'DESC')
		.take(maxMessagesCount)
		.getMany();
		
		const RecentMessages: RecentMessageAtEnter[] = [];

		return RecentMessages;
	}
}
