import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Session } from '@nestjs/common';
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
import { CreateDmChannelReqDto } from './dto/create-dm-channel-req.dto';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { FindUserDto } from 'src/users/memoryuser/dto/find-user.dto';
import { CheckChannelResDto } from './dto/check-channel-res.dto';
import { UpdateRoleAtLeaveOwnerReqDto } from './dto/update-role-at-leave-owner-req.dto';
import { UpdateRoleInLinkDto } from './dto/update-role-in-link.dto';
import { LinkChannelToUserService } from './link-channel-to-user.service';

@Controller('channel')
export class ChannelController {
	private readonly privateChannelName = 'Private memo';

	constructor(
		private channelService: ChannelService,
		private hashService: HashService,
		private messageService: MessageService,
		private userService: UserService,
		private exceptionService: ChannelExceptionService,
		private memoryUserService: MemoryUserService,
		private linkService: LinkChannelToUserService,
		private chatService: ChatService,
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
		
		await this.linkService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		
		this.chatService.enterChannel(userId, channel);
		
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
		await this.linkService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		
		this.chatService.enterChannel(userId, channel);
		
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
		const link: LinkChannelToUser = await this.linkService.getLinkByUserIdAtPrivate(userId);
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
		await this.linkService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.role(ChannelRole.OWNER)
			.user(user)
			.build()
		);
		
		this.chatService.enterChannel(userId, channel);
	
		return Builder(CreateChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	@Post('dm')
	async createDmChannel(
		@Session() session: Record<string, any>,
		@Body() reqDto: CreateDmChannelReqDto,
	): Promise<CreateChannelResDto> {
		const { invitedUserId } = reqDto;
		const { nickname: invitedNickname } = this.memoryUserService.findUserByUserId(
			Builder(FindUserDto)
			.userId(invitedUserId)
			.build()
		); // invited User 없으면 예외
		const userId: number = session.userId;
		let links: any[]
		
		if (invitedUserId === userId) {
			this.exceptionService.itIsInvalidRequest();
		}
		links = await this.linkService.getCreateDmChannelRes(userId, invitedUserId);
		if (links.length < 1) {
			const user: User = await this.userService.getUserByUserId(userId);
			const invitedUser: User = await this.userService.getUserByUserId(invitedUserId)
			const nickname: string = user.nickname;
			const channelName: string = `${nickname}, ${invitedNickname} Dm`; // max 32
			const channel: Channel = await this.channelService.createChannel(
				Builder(CreateChannelReqDto)
				.mode(ChannelMode.DM)
				.name(channelName)
				.password(null)
				.build()
			);

			this.linkService.createLinkChannelToUser(
				Builder(CreateLinkChannelToUserReqDto)
				.channel(channel)
				.user(user)
				.role(ChannelRole.OWNER)
				.build()
			);
			this.linkService.createLinkChannelToUser(
				Builder(CreateLinkChannelToUserReqDto)
				.channel(channel)
				.user(invitedUser)
				.role(ChannelRole.USER)
				.build()
			);
			
			this.chatService.enterChannel(userId, channel);
			
			return Builder(CreateChannelResDto)
			.id(channel.id)
			.name(channel.name)
			.build();
		}
		return Builder(CreateChannelResDto)
		.id(links[0].channel_id)
		.name(links[0].channel_name)
		.build();
	}

	@Get(':channelid/check')
	async checkChannel(@Param('channelid') channelId: number): Promise<CheckChannelResDto> {
		const channel = await this.channelService.getChannel(channelId);

		if (channel === null) {
			this.exceptionService.notExistChannel();
		}
		return Builder(CheckChannelResDto)
		.mode(channel.mode)
		.build();
	}

	@Post(':channelid/password')
	async authenticatePassword(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		@Body('password') password: string, // pipe
	): Promise<CreateChannelResDto> {
		const channel = await this.channelService.getChannel(channelId);
		const userId = session.userId;
		const user = await this.userService.getUserByUserId(userId);
		let link: LinkChannelToUser;

		if (channel === null) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode !== ChannelMode.PROTECTED
			|| !password
			) {
			this.exceptionService.itIsInvalidRequest();
		}
		link = await this.linkService.getLinkRelatedChannelByChannelAndUser(channel, user);
		if (link) {
			return Builder(CreateChannelResDto)
			.id(channel.id)
			.name(channel.name)
			.build();
		}

		if (await this.hashService.hashCompare(password, channel.password) === false) {
			this.exceptionService.passwordIsNotValid();
		}
		this.linkService.createLinkChannelToUser(
			Builder(CreateLinkChannelToUserReqDto)
			.channel(channel)
			.user(user)
			.role(ChannelRole.USER)
			.build()
		);
		
		this.chatService.enterChannel(userId, channel);
		
		return Builder(CreateChannelResDto)
		.id(channel.id)
		.name(channel.name)
		.build();
	}

	/**
	 * Enter Channel
	 */
	private async enterPublic(link: LinkChannelToUser, channel: Channel, user: User): Promise<LinkChannelToUser> {
		if (!link) {
			link = await this.linkService.createLinkChannelToUser(
				Builder(CreateLinkChannelToUserReqDto)
				.user(user)
				.channel(channel)
				.role(ChannelRole.USER)
				.build()
			);
			
			this.chatService.enterChannel(user.id, channel);
		}
		return link;
	}

	private isNotUserInChannel(link: LinkChannelToUser): boolean {
		return !link;
	}

	@Get(':channelid')
	async enterChannel(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		): Promise<EnterChannelRes> {
		const channel: Channel | null = await this.channelService.getChannel(channelId);
		let userId: number;
		let user: User;
		let link: LinkChannelToUser;
		let recentMessages: RecentMessageAtEnter[];

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		// if (ban 일 때)
		// this.exceptionService.youAreBanUser();
		userId = session.userId;
		user = await this.userService.getUserByUserId(userId);
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		switch(channel.mode) {
			case ChannelMode.PUBLIC:
				link = await this.enterPublic(link, channel, user);
				break;
			case ChannelMode.PROTECTED:
			case ChannelMode.PRIVATE:
			case ChannelMode.DM:
				if (this.isNotUserInChannel(link) === true) {
					this.exceptionService.itIsInvalidRequest();
				}
		}
		
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
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
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

	private async updateRoleAtLeaveOwner(dto: UpdateRoleAtLeaveOwnerReqDto) {
		const {channel} = dto;
		const adminUser: LinkChannelToUser | null = await this.linkService.getLinkRoleIsAdmin(channel.id)
		let generalUser: LinkChannelToUser | null;

		if (!adminUser) {
			generalUser = await this.linkService.getFirstLinkByChannelId(channel.id);
			if(!generalUser) { // It is imposible. But I'm afraid.
				this.exceptionService.notEnterUserInChannel();
			}
			this.linkService.updateRoleInLink(generalUser,
				Builder(UpdateRoleInLinkDto).role(ChannelRole.OWNER).build());
		}
		else {
			this.linkService.updateRoleInLink(adminUser,
				Builder(UpdateRoleInLinkDto).role(ChannelRole.OWNER).build());
		}
	}

	@Delete(':channelid')
	async leaveChannel(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
	): Promise<void> {
		const channel: Channel | null = await this.channelService.getChannel(channelId)
		const userId: number = session.userId;
		let link: LinkChannelToUser | null;
		let user: User | null;
		let countUserInChannel: number;
		let anotherUser: LinkChannelToUser;

		if (!channel) {
			this.exceptionService.notExistChannel();
		}

		user = await this.userService.getUserByUserId(userId);
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
			this.exceptionService.notEnterUserInChannel();
		}

		// delete a link in channel
		await this.linkService.deleteLink(link);
		
		this.chatService.leaveChannel(userId, channel);
		
		countUserInChannel = await this.linkService.getCountLinkInChannel(channel.id);

		// delete channel cycle
		if (countUserInChannel === 0 || channel.mode === ChannelMode.DM) {
			if (channel.mode === ChannelMode.DM) {
				anotherUser = await this.linkService.getFirstLinkByChannelId(channel.id);
				await this.linkService.deleteLink(anotherUser);
				this.chatService.leaveChannel(anotherUser.id, channel);
			}
			await this.messageService.deleteAllMessages(channel.id);
			await this.channelService.deleteBanList(channel.id);
			await this.channelService.deleteChannel(channel);
			return;
		}

		this.updateRoleAtLeaveOwner(
			Builder(UpdateRoleAtLeaveOwnerReqDto)
			.channel(channel)
			.build()
		);
	}
}
