import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
import { AddChannelReqDto } from './dto/add-channel-req.dto';
import { Builder } from 'builder-pattern';
import { ChannelService } from './channel.service';
import { CreateChannelReqDto } from './dto/create-channel-req.dto';
import { CreateLinkChannelToUserReqDto } from './dto/create-link-channel-to-user-req.dto';
import { CreateChannelResDto } from './dto/create-channel-res.dto';
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
import { CreatePublicChannelReqDto } from './dto/create-public-channel-req.dto';
import { CreateProtectedChannelReqDto } from './dto/create-protected-channel-req.dto';

@Controller('channel')
export class ChannelController {
	private readonly privateChannelName = 'Private memo';

	constructor(
		private channelService: ChannelService,
		private hashService: HashService,
		private messageService: MessageService,
		private userService: UserService,
		private exceptionService: ChannelExceptionService,
	) {}

	@Post('public')
	async createPublicChannel(
		@Session() session: Record<string, any>,
		@Body() reqDto: CreatePublicChannelReqDto,
	): Promise<CreateChannelResDto> {
		const {name} = reqDto;
		const userId: number = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		const channel: Channel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(ChannelMode.PUBLIC)
			.name(name)
			.password(null)
			.build()
		);
		
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		return Builder(CreateChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	@Post('protected')
	async createProtectedChannel(
		@Session() session: Record<string, any>,
		@Body() reqDto: CreateProtectedChannelReqDto, // password pipe, null 일 때 예외처리
	): Promise<CreateChannelResDto> {
		const { name, password } = reqDto;
		const userId = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		let channel: Channel;

		if (password === '') { // 파이프 구현하고 삭제하기
			throw new HttpException('지윤, 재상아 비어있는 것도 비밀번호로 처리 된다~', HttpStatus.BAD_REQUEST);
		}	

		channel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(ChannelMode.PROTECTED)
			.name(name)
			.password(await this.hashService.hashPassword(password))
			.build()
		);
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		return Builder(CreateChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	@Post('private')
	async createPrivateChannel(
		@Session() session: Record<string, any>,
	) {
		const userId: number = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		const link: LinkChannelToUser = await this.channelService.getLinkByUserIdAtPrivate(userId);
		let channel: Channel;

		if (link) {
			return Builder(CreateChannelResDto)
			.id(link.channel.id)
			.name(link.channel.name)
			.build();
		}
		channel = await this.channelService.createChannel(
			Builder(CreateChannelReqDto)
			.mode(ChannelMode.PRIVATE)
			.name(this.privateChannelName)
			.password(null)
			.build()
		);
		this.channelService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		return Builder(CreateChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	// @Post()
	// async addChannel(
	// 	@Session() session: Record<string, any>,
	// 	@Body() addChannelReqDto: AddChannelReqDto, // 채널 name 파이프 구현 필요
	// ): Promise<CreateChannelResDto> {
	// 	const {name, mode, password} = addChannelReqDto;
	// 	const userId = session.userId;
	// 	const user = await this.userService.getUserByUserId(userId);
	// 	let channel: Channel;

	// 	if (mode !== ChannelMode.PROTECTED && password === '') { // 파이프 구현하고 삭제하기
	// 		throw new HttpException('지윤, 재상아 비밀번호가 없을 땐 null 로 줘야지!', HttpStatus.OK);
	// 	}
	// 	if (mode === ChannelMode.DM) {
	// 		this.exceptionService.itIsInvalidRequest();
	// 	}
	// 	if (mode !== ChannelMode.PROTECTED && password) {
	// 		this.exceptionService.itIsInvalidRequest();
	// 	}
	// 	// 이미 private 이 자신이 만든적이 있다면 예외처리

	// 	channel = await this.channelService.createChannel(
	// 		Builder(CreateChannelReqDto)
	// 		.mode(mode)
	// 		.name(name)
	// 		.password(await this.hashService.hashPassword(password))
	// 		.build()
	// 	);
	// 	this.channelService.createLinkChannelToUser(
	// 		Builder(CreateLinkChannelToUserReqDto)
	// 		.user(user)
	// 		.channel(channel)
	// 		.role(ChannelRole.OWNER)
	// 		.build()
	// 	);
	// 	return Builder(CreateChannelResDto)
	// 	.id(channel.id)
	// 	.name(channel.name)
	// 	.build();
	// }

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
		if (!this.channelService.isUserInChannel(link)) {
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
