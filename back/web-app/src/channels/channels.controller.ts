import { Controller, Get, Session } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { UserService } from 'src/users/user/user.service';

@Controller('channels')
export class ChannelsController {
	constructor(
		private channelsService: ChannelsService,
		private userService: UserService,
	) {}

	@Get()
	getAllChannels() {
		return this.channelsService.getAllChannels();
	}

  @Get('mine')
  async getMyChannels(@Session() session: Record<string, any>,) {
    const userId = session.userId;
    const user = await this.userService.getUserByUserId(userId);

    user.links.forEach(link => {
      link.channelId; // messageId 추가 예정, message 와 메시지를 보낸 유저의 nickname 가져오기
    })
  }
}
