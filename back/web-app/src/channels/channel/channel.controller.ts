import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { AddChannelResDto } from './dto/add-channel-res.dto';
import { HashService } from 'src/common/hash/hash.service';
import { MessageService, TestMessageReqSer } from '../message/message.service';

export class TestMessageReqCon {
	channelId: number;
	content: string;
	nickname: string;
}

@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private hashService: HashService,
		private messageService: MessageService,
	) {}

	@Post('test')
	async testMessage(@Body() dto: TestMessageReqCon) {
		const { channelId, content, nickname } = dto;
		const channel = await this.channelService.getChannel(channelId);

		this.messageService.testMessage(
			Builder(TestMessageReqSer)
			.channel(channel)
			.content(content)
			.nickname(nickname)
			.timestamp(new Date())
			.build()
		)
	}

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
			.password(await this.hashService.hashPassword(password))
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
		const channel = await this.channelService.getChannel(channelId);

		if (channel === null) {
			throw new HttpException('채널이 존재하지 않습니다.', HttpStatus.OK);
		}
	}

	@Post(':channelid/password')
	async authenticatePassword(
		@Session() session: Record<string, any>,
		@Param() channelId: number,
		@Body() password: string, // pipe
	): Promise<void> {
		const userId = session.userId;
		const channel = await this.channelService.getChannel(channelId);

		if (channel === null) {
			throw new HttpException('채널이 존재하지 않습니다.', HttpStatus.OK);
		}
		if (await this.hashService.hashCompare(password, channel.password) === false) {
			throw new HttpException('비밀번호가 일치하지 않습니다!', HttpStatus.OK);
		}
		// 맞으면 채널에 넣기 => LinkChannelToUser 에 추가
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.userId(userId)
			.build()
		);
	}
}
