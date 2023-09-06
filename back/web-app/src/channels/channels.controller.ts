import { Controller, Get, Session } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { LinkChannelToUser } from './channel/entity/link-channel-to-user.entity';
import { MyChannels } from './channel/dto/my-channels.dto';
import { Channel } from './channel/entity/channel.entity';

@Controller('channels')
export class ChannelsController {
	constructor(
		private channelsService: ChannelsService,
	) {}

	@Get()
	async getAllChannels(): Promise<Channel[]> {
		return await this.channelsService.getAllChannels();
	}

  @Get('mine')
  async getMyChannels(@Session() session: Record<string, any>,)
	:Promise<MyChannels[]> {
    const userId: number = session.userId;
    const links: LinkChannelToUser[] = await this.channelsService.getLinksRelatedChannelAndUserByUserId(userId);

		return await this.channelsService.getMyChannels(links);
  }
}
