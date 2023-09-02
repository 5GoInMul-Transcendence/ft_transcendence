import { Body, Controller, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';

@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
	) {}

	@Post()
	async addChannel(
		@Session() session: Record<string, any>,
		@Body() addChannelReqDto: AddChannelReqDto, // 채널 name 파이프 구현 필요
	) {
		const {name, mode, password} = addChannelReqDto;
		const userId = session.userId;
		const createdChannel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(mode)
			.name(name)
			.password(password)
			.build()
		);

		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.userId(userId)
			.channel(createdChannel)
			.build()
		);
		return this.channelService.getAddChannelRes(createdChannel.id, createdChannel.name);
	}
}
