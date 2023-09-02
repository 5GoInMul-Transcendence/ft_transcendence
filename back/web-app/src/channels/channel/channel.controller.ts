import { Body, Controller, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from 'src/users/memoryuser/dto/find-user.dto';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';

@Controller('channel')
export class ChannelController {
	constructor(
		// private memoryUserService: MemoryUserService,
		private channelService: ChannelService,
	) {}

	@Post()
	async addChannel(
		// @Session() session: Record<string, any>,
		@Body() addChannelReqDto: AddChannelReqDto, // 채널 name 파이프 구현 필요
	) {
		// const me = this.memoryUserService.findUserByUserId(
		// 	Builder(FindUserDto).userId(session.userId).build(),
		// );
		const {name, mode, password} = addChannelReqDto;
		const createdChannel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(mode)
			.name(name)
			.password(password)
			.build()
		);
		// my channel 에 추가
		return this.channelService.getAddChannelRes(createdChannel.id, createdChannel.name);
	}
}
