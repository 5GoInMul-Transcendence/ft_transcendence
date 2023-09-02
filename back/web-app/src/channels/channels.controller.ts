import { Controller, Get } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
	constructor(
		private channelsService: ChannelsService,
	) {}

	@Get()
	getAllChannels() {
		return this.channelsService.getAllChannels();
	}
}
