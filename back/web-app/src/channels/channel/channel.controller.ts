import { Body, Controller, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from 'src/users/memoryuser/dto/find-user.dto';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';

@Controller('channel')
export class ChannelController {
	constructor(
		// private memoryUserService: MemoryUserService,
		private channelService: ChannelService,
	) {}

	@Post()
	async addChannel(
		@Session() session: Record<string, any>,
		@Body() addChannelReqDto: AddChannelReqDto, // 채널 name 파이프 구현 필요
	) {
		// const me = this.memoryUserService.findUserByUserId(   // 여기에서 굳이 memoryUser 를 가져올 필요가 없다. 이미 AuthModdleware 에서 해당 userId 에 대한 session 을 확인했으니 유효한 유저이다.
		// 	Builder(FindUserDto).userId(session.userId).build(),
		// );
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
