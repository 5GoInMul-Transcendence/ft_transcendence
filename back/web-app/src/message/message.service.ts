import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
		const maxMessagesCount: number = 50;
		const messages: Message[] = await this.messageRepository
		.createQueryBuilder('message')
		.select(['message.id', 'message.content', 'message.timestamp'])
		.leftJoinAndSelect('message.user', 'user')
		.where('message.channel = :channelId', {channelId})
		.orderBy('message.timestamp', 'DESC')
		.take(maxMessagesCount)
		.getMany()
		.then(value => {
			return value.reverse();
		})
		.catch(() => {
			throw new HttpException(`Can't load messages`, HttpStatus.BAD_REQUEST);
		})
		const RecentMessages: RecentMessageAtEnter[] = messages.map((message) => {
			const nicknameSendingMessage: string = message.user.nickname;
			const avatar: string = message.user.avatar;

			return Builder(RecentMessageAtEnter)
			.id(message.id)
			.content(message.content)
			.nickname(nicknameSendingMessage)
			.avatar(avatar)
			.build()
		});

		return RecentMessages;
	}

	async getRecentMessageRelatedUserByChannelId(channel: Channel): Promise<Message | null> {
		return await this.messageRepository
		.createQueryBuilder('message')
		.leftJoinAndSelect('message.user', 'user')
		.where('message.channel = :channelId', {channelId: channel.id})
		.orderBy('message.timestamp', 'DESC')
		.getOne();
	}

	async deleteAllMessages(channelId: number): Promise<void> {
		await this.messageRepository
		.createQueryBuilder()
		.delete()
		.where('channel = :channelId', {channelId})
		.execute();
	}
}
