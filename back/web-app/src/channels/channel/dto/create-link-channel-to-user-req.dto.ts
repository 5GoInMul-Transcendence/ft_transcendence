import { Channel } from "../entity/channel.entity";

export class CreateLinkChannelToUserReqDto {
	readonly userId: number;
	readonly channel: Channel;
};