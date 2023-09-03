import { Channel } from "../entity/channel.entity";

export class SendMessageDto {
	nickname: string;
	channel: Channel;
	content: string;
	timestamp: Date;
}