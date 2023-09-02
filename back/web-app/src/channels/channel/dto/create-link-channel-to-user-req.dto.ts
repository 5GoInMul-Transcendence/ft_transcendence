import { Channel } from "../entity/channel.entity";

export class CreateLinkChannelToUserReqDto {
	userId: number;
	channel: Channel;
};