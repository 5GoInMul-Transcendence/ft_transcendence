import { Channel } from "../entity/channel.entity";

export class SendMessageDto {
	readonly userId: number;
	readonly channel: Channel;
	readonly content: string;
	readonly timestamp: Date;
}