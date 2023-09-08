import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from '../channels/channel/dto/send-message.dto';
import { Channel } from '../channels/channel/entities/channel.entity';
import { RecentMessageAtEnter } from 'src/channels/channel/dto/recent-message-at-enter.dto';
import { Builder } from 'builder-pattern';

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

	async getMessages(channelId: number): Promise<RecentMessageAtEnter[]> {
		const maxMessagesCount = 50;
		const messages = await this.messageRepository
		.createQueryBuilder('message')
		.select(['message.id', 'message.content', 'message.timestamp'])
		.leftJoinAndSelect('message.user', 'user') // user 라는 사용자 entity 선택 후 이를 join 함
		.where('message.channel = :channelId', {channelId}) // .where('message.channel.id = :channelId', {channelId}) // 위와 같은 의미라는 것을 의미, 삭제해도 됨
		.orderBy('message.timestamp', 'DESC')
		.take(maxMessagesCount)
		.getMany();
		const RecentMessages: RecentMessageAtEnter[] = messages.map((message) => {
			const nicknameSendingMessage: string = message.user.nickname;

			return Builder(RecentMessageAtEnter)
			.id(message.id)
			.content(message.content)
			.nickname(nicknameSendingMessage)
			.build()
		});

		return RecentMessages;
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
