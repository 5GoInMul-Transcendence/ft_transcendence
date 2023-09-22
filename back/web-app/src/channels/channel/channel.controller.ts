import { Body, Controller, Delete, Get, Put, HttpException, HttpStatus, Param, Post, Session, ParseIntPipe } from '@nestjs/common';
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
import { ChatService } from '../../chat/chat.service';
import { ChannelSettingService } from './channel-setting.service';
import { UpdateChannelSettingReqDto } from './dto/update-channel-setting-req.dto';
import { GetUserSettingInChannelResDto } from './dto/get-user-setting-in-channel-res.dto';
import { UserSettingService } from './user-setting/user-setting.service';
import { UpdateUserSettingInChannelReqDto } from './dto/update-user-setting-in-channel-req.dto';
import { IsMutedUserReqDto } from './dto/is-muted-user-req.dto';
import { UserSettingStatus } from './enum/user-setting-status.enum';
import { BlockDto } from '../../block/dto/block.dto';
import { BlockService } from '../../block/block.service';
import { MessageType } from '../../message/enums/message-type.enum';
import { AuthenticatePasswordReqDto } from './dto/authenticate-password-req.dto';

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
		private settingService: ChannelSettingService,
		private userSettingService: UserSettingService,
		private blockService: BlockService,
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
		if (this.blockService.isBlockedUser(userId, invitedUserId)) {
			this.exceptionService.iBlockedHim();
		}
		if (this.blockService.isBlockedUser(invitedUserId, userId)) {
			this.exceptionService.youAreBlock();
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
			
			this.chatService.enterChannel(invitedUserId, channel);
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
	async checkChannel(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
	): Promise<CheckChannelResDto> {
		const channel = await this.channelService.getChannel(channelId);
		const userId: number = session.userId;
		let isBan: boolean;

		if (channel === null) {
			this.exceptionService.notExistChannel();
		}
		isBan = this.userSettingService.isBanUser(channel.id, userId);
		return Builder(CheckChannelResDto)
		.mode(channel.mode)
		.isBan(isBan)
		.build();
	}

	@Post(':channelid/password')
	async authenticatePassword(
		@Param('channelid', ParseIntPipe) channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: AuthenticatePasswordReqDto,
	): Promise<CreateChannelResDto> {
		const {password} = dto;
		const channel = await this.channelService.getChannel(channelId);
		const userId = session.userId;
		const user = await this.userService.getUserByUserId(userId);
		let link: LinkChannelToUser;

		if (this.userSettingService.isBanUser(channelId, userId)) {
			this.exceptionService.youAreBan();
		}
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

		await this.linkService.createLinkChannelToUser(
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
		@Param('channelid', ParseIntPipe) channelId: number,
		@Session() session: Record<string, any>,
		): Promise<EnterChannelRes> {
		const channel: Channel | null = await this.channelService.getChannel(channelId);
		const userId: number = session.userId;
		let user: User;
		let link: LinkChannelToUser;
		let recentMessages: RecentMessageAtEnter[];

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		if (this.userSettingService.isBanUser(channelId, userId)) {
			this.exceptionService.youAreBan();
		}
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
		
		for (const recentMessage of recentMessages) {
			if (this.blockService.isBlockedUser(userId, recentMessage.userId)) {
				recentMessage.content = MessageType.BLOCKED;
			}
			delete recentMessage.userId;
		}
		
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
		@Param('channelid', ParseIntPipe) channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: SendMessageReq,
		): Promise<void> {
		const userId: number = session.userId;
		const { message } = dto;
		let channel: Channel;
		let user: User;
		let link: LinkChannelToUser | null;

		if (this.userSettingService.isMutedUser(
			Builder(IsMutedUserReqDto)
			.channelId(channelId)
			.userId(userId)
			.build()
		)) {
			this.exceptionService.youAreMute();
		}

		channel = await this.channelService.getChannel(channelId);
		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		user = await this.userService.getUserByUserId(userId);
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
			this.exceptionService.notEnterUserInChannel();
		}
		const createdMessage = await this.messageService.sendMessage(
			Builder(SendMessageDto)
			.channel(channel)
			.content(message)
			.user(user)
			.timestamp(new Date())
			.build()
		);
    this.chatService.sendMessage(createdMessage);
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
				this.chatService.leaveChannel(anotherUser.user.id, channel);
			}
			// ban, mute memory map
			await this.messageService.deleteAllMessages(channel.id);
			await this.channelService.deleteChannel(channel);
			return;
		}

		this.updateRoleAtLeaveOwner(
			Builder(UpdateRoleAtLeaveOwnerReqDto)
			.channel(channel)
			.build()
		);
	}

	/**
	 * Channel setting
	 */
	@Get('setting/:channelid/')
	async getChannelInformation(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
	) {
		const userId: number = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		const channel: Channel = await this.channelService.getChannel(channelId);
		let link: LinkChannelToUser | null;
		let linksInChannel: LinkChannelToUser[];

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		// private, dm is impossible to change and get info;
		if (channel.mode !== ChannelMode.PUBLIC && channel.mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}
		
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
			this.exceptionService.notEnterUserInChannel();
		}

		linksInChannel = await this.linkService.getLinksRelatedUserByChannelId(channelId);
		return this.settingService.getChannelInformation(linksInChannel);
	}

	@Put('setting/:channelid')
	async updateChannelSetting(
		@Param('channelid') channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: UpdateChannelSettingReqDto, // pipe
	) {
		let {mode, password} = dto;
		const userId: number = session.userId;
		const user: User = await this.userService.getUserByUserId(userId);
		const channel: Channel = await this.channelService.getChannel(channelId);
		let linkOfOwner: LinkChannelToUser | null;

		if (mode !== ChannelMode.PUBLIC && mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}
		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode !== ChannelMode.PUBLIC && channel.mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}

		linkOfOwner = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!linkOfOwner) {
			this.exceptionService.notEnterUserInChannel();
		}
		if (linkOfOwner.role !== ChannelRole.OWNER) {
			this.exceptionService.itIsNotOwner();
		}
		this.channelService.updateChannelSetting(channelId, mode, password);
	}

	@Get('setting/:channelid/:userid')
	async getUserSettingInChannel(
		@Param('channelid', ParseIntPipe) channelId: number,
		@Param('userid', ParseIntPipe) targetUserId: number,
		@Session() session: Record<string, any>,
	) {
		const userId: number = session.userId;
		const channel: Channel = await this.channelService.getChannel(channelId);
		let user: User;
		let link: LinkChannelToUser;
		let role: string;
		let targetUser: User;
		let targetLink: LinkChannelToUser;
		let targetRole: string;
		let isMute: boolean;
		let isBan: boolean;

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode !== ChannelMode.PUBLIC && channel.mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}

		user = await this.userService.getUserByUserId(userId);
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
			this.exceptionService.notEnterUserInChannel();
		}
		// Check request user's role
		role = link.role;
		if (role === ChannelRole.USER) {
			this.exceptionService.itIsNotAdmin();
		}

		targetUser = await this.userService.getUserByUserId(targetUserId);
		if (!targetUser) {
			this.exceptionService.itIsInvalidRequest();
		}
		targetLink = await this.linkService.getLinkByChannelAndUser(channel, targetUser);
		if (!targetLink) {
			this.exceptionService.itIsInvalidRequest();
		}
		targetRole = targetLink.role;
		isMute = this.userSettingService.isMutedUser(
			Builder(IsMutedUserReqDto)
			.channelId(channelId)
			.userId(targetUserId)
			.build()
		);
		isBan = this.userSettingService.isBanUser(channelId, targetUserId);
		
		return Builder(GetUserSettingInChannelResDto)
		.admin(targetRole === ChannelRole.USER ? false : true)
		.mute(isMute)
		.ban(isBan)
		.build();
	}

	/**
	 * User setting in channel
	 */
	private async updateRoleInUserSetting(
			link: LinkChannelToUser,
			targetLink: LinkChannelToUser,
	): Promise<void> {
		if (link.role !== ChannelRole.OWNER) {
			this.exceptionService.itIsNotOwner();
		}
		if (targetLink.role === ChannelRole.ADMIN) { // Change to user
			await this.linkService.updateRoleInLink(targetLink, Builder(UpdateRoleInLinkDto)
			.role(ChannelRole.USER)
			.build()
			);
		}
		else { // Change to admin
			await this.linkService.updateRoleInLink(targetLink, Builder(UpdateRoleInLinkDto)
			.role(ChannelRole.ADMIN)
			.build()
			);
		}
	}
	
	private updateMuteInUserSetting(
		channelId: number,
		targetUserId: number,
	): void {
		if (this.userSettingService.isMutedUser(
			Builder(IsMutedUserReqDto)
			.channelId(channelId)
			.userId(targetUserId)
			.build()
		) === false) {
			this.userSettingService.addMutedUser(channelId, targetUserId);
		}
		else {
			this.userSettingService.deleteMutedUser(channelId, targetUserId);
		}
	}

	private async updateKickInUserSetting(
		targetLink: LinkChannelToUser,
		targetUserId: number,
		channel: Channel,
	): Promise<void> {
		this.chatService.leaveChannel(targetUserId, channel)
		await this.linkService.deleteLink(targetLink);
	}

	private async updateBanInUserSetting(
		channel: Channel,
		targetId: number,
		targetLink: LinkChannelToUser,
	): Promise<void> {
		const channelId: number = channel.id;

		if (this.userSettingService.isBanUser(channelId, targetId) === false) {
			this.chatService.leaveChannel(targetId, channel)
			await this.linkService.deleteLink(targetLink);
			this.userSettingService.addBanUser(channelId, targetId);
		}
		else {
			this.userSettingService.deleteBanUser(channelId, targetId);
		}
	}

	@Put('setting/:channelid/user')
	async updateUserSettingInChannel(
		@Param('channelid', ParseIntPipe) channelId: number,
		@Session() session: Record<string, any>,
		@Body() dto: UpdateUserSettingInChannelReqDto // pipe status
	): Promise<void> {
		const {id: targetUserId, status} = dto;
		const userId: number = session.userId;
		const channel: Channel = await this.channelService.getChannel(channelId);
		let user: User;
		let link: LinkChannelToUser;
		let role: string;
		let targetUser: User;
		let targetLink: LinkChannelToUser;
		let targetRole: string;

		if (!channel) {
			this.exceptionService.notExistChannel();
		}
		if (channel.mode !== ChannelMode.PUBLIC && channel.mode !== ChannelMode.PROTECTED) {
			this.exceptionService.itIsInvalidRequest();
		}

		if (userId === targetUserId) {
			this.exceptionService.sameUser();
		}

		user = await this.userService.getUserByUserId(userId);
		link = await this.linkService.getLinkByChannelAndUser(channel, user);
		if (!link) {
			this.exceptionService.notEnterUserInChannel();
		}
		// Check request user's role
		role = link.role;
		if (role === ChannelRole.USER) {
			this.exceptionService.itIsNotAdmin();
		}

		targetUser = await this.userService.getUserByUserId(targetUserId);
		if (!targetUser) {
			this.exceptionService.itIsInvalidRequest();
		}
		targetLink = await this.linkService.getLinkByChannelAndUser(channel, targetUser);
		if (!targetLink) {
			this.exceptionService.itIsInvalidRequest();
		}
		targetRole = targetLink.role;
		if (role === ChannelRole.ADMIN && targetRole !== ChannelRole.USER) {
			this.exceptionService.itIsNotOwner();
		}

		switch (status) {
			case UserSettingStatus.ADMIN: // only possible owner
				await this.updateRoleInUserSetting(link, targetLink);
				break;
			case UserSettingStatus.MUTE:
				this.updateMuteInUserSetting(channelId, targetUserId);
				break;
			case UserSettingStatus.KICK:
				await this.updateKickInUserSetting(targetLink, targetUserId, channel);
				break;
			case UserSettingStatus.BAN:
				this.updateBanInUserSetting(channel, targetUserId, targetLink);
		}
	}
	
	@Post('block')
	async block(@Session() session, @Body('blockUserId') blockUserId) {
		const userId = session.userId;
		
		const isBlocked = this.blockService.block(
				Builder(BlockDto).userId(userId).blockUserId(blockUserId).build(),
		);
		
		if (isBlocked) {
			const dmChannelLinks: any[] = await this.linkService.getCreateDmChannelRes(
					userId,
					blockUserId,
			);
			
			if (dmChannelLinks.length == 0) {
				return;
			}
			
			const channel = await this.channelService.getChannel(dmChannelLinks[0].channel_id);
			
			// broadcast
			this.chatService.leaveChannel(userId, channel);
			this.chatService.leaveChannel(blockUserId, channel);
			
			// delete link
			const links =  await this.linkService.getLinksRelatedUserByChannelId(dmChannelLinks[0].channel_id);
			for (const link of links) {
				this.linkService.deleteLink(link);
			}
			
			// delete message
			await this.messageService.deleteAllMessages(channel.id);
			// 밴리스트 삭제 추가 예정
			// 뮤트 삭제 추가 예정
			await this.channelService.deleteChannel(channel);
			return;
		}
	}
}
