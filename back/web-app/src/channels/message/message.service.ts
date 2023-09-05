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

	async getMessages(channelId: number, nickname: string): Promise<RecentMessageAtEnter[]> {
		// 시간 순서대로 나열된 리스트에서 시간을 기준으로 내림차 순으로 정렬한 뒤 최근 50개 항목만 불러온다.
		// message repository 에서 message 테이블을 사용한다.
		// 
		const maxMessagesCount = 50;
		const messages = await this.messageRepository
		.createQueryBuilder('message')
		.select(['message.id', 'message.content'])
		.where('message.channel.id = :channelId', {channelId})
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
