import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { AddChannelResDto } from './dto/add-channel-res.dto';
import { HashService } from 'src/common/hash/hash.service';
import { MessageService } from '../message/message.service';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { SendMessageReq } from './dto/send-message-req.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/users/user/user.service';
import { LinkChannelToUser } from './entity/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { Channel } from './entity/channel.entity';

@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private hashService: HashService,
		private messageService: MessageService,
		private userService: UserService,
	) {}

	@Post(':channelid/chat')
	async sendMessage(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: SendMessageReq,
		) {
		const channel: Channel = await this.channelService.getChannel(channelId); // 채팅방이 존재하지 않을 때 에러?
		const userId: number = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		const nickname: string = user.nickname;
		const { message } = dto;
		const link: LinkChannelToUser | null = await this.channelService.getLinksByChannelAndUser(user, channel); // 얘 때문에 user, channel 객체가 다 필요함

		if (link === null) {
			throw new HttpException('채팅 방에 입장한 상태가 아닙니다.', HttpStatus.UNAUTHORIZED);
		}
		this.messageService.sendMessage(
			Builder(SendMessageDto)
			.channel(channel)
			.content(message)
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
		@Param('channelid') channelId: number,
		@Body('password') password: string, // pipe
	): Promise<void> {
		const userId = session.userId;
		const channel = await this.channelService.getChannel(channelId);

		if (channel === null) {
			throw new HttpException('채널이 존재하지 않습니다.', HttpStatus.OK);
		}
		if (password && channel.password === null) {
			throw new HttpException('채팅방에 비밀번호가 존재하지 않습니다!', HttpStatus.OK);
		}
		if (await this.hashService.hashCompare(password, channel.password) === false) {
			throw new HttpException('비밀번호가 일치하지 않습니다!', HttpStatus.OK);
		}
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.userId(userId)
			.build()
		);
	}
}
