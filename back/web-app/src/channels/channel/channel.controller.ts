import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { AddChannelResDto } from './dto/add-channel-res.dto';
import { HashService } from 'src/common/hash/hash.service';
import { MessageService } from '../../message/message.service';
import { SendMessageReq } from './dto/send-message-req.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UserService } from 'src/users/user/user.service';
import { LinkChannelToUser } from './entities/link-channel-to-user.entity';
import { User } from 'src/users/user/entities/user.entity';
import { Channel } from './entities/channel.entity';
import { EnterChannelRes } from './dto/enter-channel-res.dto';
import { ChannelRole } from './enum/channel-role.enum';
import { RecentMessageAtEnter } from './dto/recent-message-at-enter.dto';
import { ChannelMode } from './enum/channel-mode.enum';
import { ChannelExceptionService } from './exception/channel-exception.service';

@Controller('channel')
export class ChannelController {
	constructor(
		private channelService: ChannelService,
		private hashService: HashService,
		private messageService: MessageService,
		private userService: UserService,
		private exceptionService: ChannelExceptionService,
	) {}

	@Post()
	async addChannel(
		@Session() session: Record<string, any>,
		@Body() addChannelReqDto: AddChannelReqDto, // 채널 name 파이프 구현 필요
	): Promise<AddChannelResDto> {
		const {name, mode, password} = addChannelReqDto;
		const userId = session.userId;
		const user = await this.userService.getUserByUserId(userId);
		const channel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(mode)
			.name(name)
			.password(await this.hashService.hashPassword(password))
			.build()
		);

		if (channel.mode !== ChannelMode.PROTECTED && password === '') { // 파이프 구현하고 삭제하기
			throw new HttpException('지윤, 재상아 비밀번호가 없을 땐 null 로 줘야지!', HttpStatus.OK);
		}
		if (channel.mode === ChannelMode.DM) {
			this.exceptionService.itIsInvalidRequest();
		}
		if (channel.mode !== ChannelMode.PROTECTED && password) {
			this.exceptionService.itIsInvalidRequest();
		}
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.user(user)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.build()
		);
		return Builder(AddChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	@Get(':channelid/check')
	async checkChannel(@Param('channelid') channelId: number): Promise<void> {
		const channel = await this.channelService.getChannel(channelId);

		if (channel === null) {
			this.exceptionService.notExistChannel();
		}
	}

	@Post(':channelid/password')
	async authenticatePassword(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		@Body('password') password: string, // pipe
	): Promise<void> {
		const channel = await this.channelService.getChannel(channelId);
		const userId = session.userId;
		const user = await this.userService.getUserByUserId(userId);

		if (channel === null) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}
		if (!password) {
			this.exceptionService.itIsInvalidRequest();
		}
		if (await this.hashService.hashCompare(password, channel.password) === false) {
			this.exceptionService.itIsInvalidRequest();
		}
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.user(user)
			.role(ChannelRole.USER)
			.build()
		);
	}

	@Get(':channelid')
	async enterChannel(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		): Promise<EnterChannelRes> {
		const channel = await this.channelService.getChannel(channelId);
		let userId: number;
		let user: User;
		let link: LinkChannelToUser;
		let recentMessages: RecentMessageAtEnter[];

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode === ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}
		if (channel.mode === ChannelMode.PRIVATE) {
			this.exceptionService.itIsInvalidRequest();
		}
		// dm 모드 생기면 추가
		// if (channel.mode !== ChannelMode.DM && channel.invitedUser) {
		// 	this.exceptionService.itIsInvalidRequest();
		// }
		// if (ban 일 때)
		// this.exceptionService.youAreBanUser();

		userId = session.userId;
		user = await this.userService.getUserByUserId(userId);
		link = await this.channelService.getLinkByChannelAndUser(channel, user);

		if (!this.channelService.isUserInChannel(link)) {
			link = await this.channelService.createLinkChannelToUser(
				Builder(CreateLinkChannelToUserReqDto)
				.user(user)
				.channel(channel)
				.role(ChannelRole.USER)
				.build()
			);
		}
		// dm 일 때 구현
		// if (channel.mode === ChannelMode.DM) {
		// }
		
		recentMessages = await this.messageService.getMessages(channel.id);

		return Builder(EnterChannelRes)
		.id(channel.id)
		.name(channel.name)
		.role(link.role)
		.mode(channel.mode)
		.recentMessage(recentMessages)
		.build();
	}

	@Post(':channelid/chat')
	async sendMessage(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: SendMessageReq,
		): Promise<void> {
		const userId: number = session.userId;
		const { message } = dto;
		let channel: Channel;
		let user: User;
		let link: LinkChannelToUser | null;

		channel = await this.channelService.getChannel(channelId);
		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		user = await this.userService.getUserByUserId(userId);
		link = await this.channelService.getLinkByChannelAndUser(channel, user);
		if (link === null) {
			this.exceptionService.notEnterUserInChannel();
		}
		this.messageService.sendMessage(
			Builder(SendMessageDto)
			.channel(channel)
			.content(message)
			.user(user)
			.timestamp(new Date())
			.build()
		);
	}
}
