import { Injectable } from '@nestjs/common';
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

	async getMessages(channelId: number, nickname: string): Promise<RecentMessageAtEnter[]> {
		const maxMessagesCount = 50;
		const messages = await this.messageRepository
		.createQueryBuilder('message')
		.select(['message.id', 'message.content'])
		.where('message.channel = :channelId', {channelId})
		// .where('message.channel.id = :channelId', {channelId}) // 위와 같은 의미라는 것을 의미, 삭제해도 됨
		.orderBy('message.timestamp', 'DESC')
		.take(maxMessagesCount)
		.getMany();
		const RecentMessages: RecentMessageAtEnter[] = messages.map((message) => {
			return Builder(RecentMessageAtEnter)
			.id(message.id)
			.content(message.content)
			.nickname(nickname)
			.build()
		});
		
		return RecentMessages;
	}
}
