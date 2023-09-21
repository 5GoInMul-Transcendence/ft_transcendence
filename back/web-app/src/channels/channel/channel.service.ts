import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { LinkChannelToUser } from './entities/link-channel-to-user.entity';
import { MyChannels } from './dto/my-channels.dto';
import { RecentMessage } from './dto/recent-message.dto';
import { Builder } from 'builder-pattern';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { ChannelMode } from './enum/channel-mode.enum';
import { HashService } from 'src/common/hash/hash.service';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		private messageService: MessageService,
		private hashService: HashService,
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

	async getChannel(id: number): Promise<Channel | null> {
		return await this.channelRepository.findOne({
			where: {
				id,
			}
		});
	}

	async getAllChannels(): Promise<Channel[]> {
		return await this.channelRepository
		.createQueryBuilder('channel')
		.select(['channel.id', 'channel.name'])
		.where('channel.mode = :modeA', {modeA: ChannelMode.PUBLIC})
		.orWhere('channel.mode = :modeB', {modeB: ChannelMode.PROTECTED})
		.getMany();
	}

	async getMyChannels(reqUserLinks: LinkChannelToUser[]): Promise<MyChannels[]> {
		let myChannelList: MyChannels[] = [];

		for (const link of reqUserLinks) {
      const channel = link.channel;
			const message: Message = await this.messageService.getRecentMessageRelatedUserByChannelId(channel);
			const nicknameSendingMessage: string = message?.user.nickname;
			const recentMessage: RecentMessage = Builder(RecentMessage)
			.id(message?.id ?? -1)
			.content(message?.content ?? '')
			.nickname(nicknameSendingMessage ?? '')
			.build();

			myChannelList.push(Builder(MyChannels)
			.id(channel.id)
			.name(channel.name)
			.recentMessage(recentMessage)
			.build()
			);
    }
		return myChannelList;
	}

	async updateChannelSetting(channelId: number, mode: string, password: string) {
		if (mode === ChannelMode.PUBLIC) {
			password = null;
		}
		const updatedInformations = {
			mode,
			password: await this.hashService.hashPassword(password),
		};
		this.channelRepository.update(channelId, updatedInformations)
	}

	async deleteChannel(channel: Channel): Promise<void> {
		await this.channelRepository.remove(channel);
	}
}
