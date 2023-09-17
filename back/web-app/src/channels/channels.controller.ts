import { Controller, Get, Session } from '@nestjs/common';
import { LinkChannelToUser } from './channel/entities/link-channel-to-user.entity';
import { MyChannels } from './channel/dto/my-channels.dto';
import { ChannelService } from './channel/channel.service';
import { Channel } from './channel/entities/channel.entity';
import { LinkChannelToUserService } from './channel/link-channel-to-user.service';

@Controller('channels')
export class ChannelsController {
	constructor(
		private channelService: ChannelService,
		private linkService: LinkChannelToUserService,
	) {}

	@Get()
	async getAllChannels(): Promise<Channel[]> {
		return await this.channelService.getAllChannels();
	}

  @Get('mine')
  async getMyChannels(@Session() session: Record<string, any>,)
	:Promise<MyChannels[]> {
    const userId: number = session.userId;
    const links: LinkChannelToUser[] = await this.linkService.getLinksRelatedChannelByUserId(userId);

		return await this.channelService.getMyChannels(links);
  }
}
