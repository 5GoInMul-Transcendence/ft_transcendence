import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { AddChannelResDto } from './dto/add-channel-res.dto';

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
		return Builder(AddChannelResDto)
		.id(createdChannel.id)
		.name(createdChannel.name)
		.build();
	}

	@Get(':channelid/check')
	async checkChannel(@Param('channelid') channelId: number): Promise<void> {
		if (await this.channelService.isValidChannel(channelId) === false) {
			throw new HttpException('채널이 존재하지 않습니다.', HttpStatus.OK);
		}
	}
}
