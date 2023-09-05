import { Controller, Get, Session } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { UserService } from 'src/users/user/user.service';
import { User } from 'src/users/user/entities/user.entity';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { MyChannels } from './channel/dto/my-channels.dto';

@Controller('channels')
export class ChannelsController {
	constructor(
		private channelsService: ChannelsService,
	) {}

	@Get()
	getAllChannels() {
		return this.channelsService.getAllChannels();
	}

  @Get('mine')
  async getMyChannels(@Session() session: Record<string, any>,)
	:Promise<MyChannels[]> {
    const userId: number = session.userId;
    const links: LinkChannelToUser[] = await this.channelsService.getLinksByUserId(userId);

		return await this.channelsService.getMyChannels(links);
  }
}
