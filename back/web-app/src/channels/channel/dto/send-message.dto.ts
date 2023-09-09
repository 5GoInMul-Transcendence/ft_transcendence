import { User } from "src/users/user/entities/user.entity";
import { Channel } from "../entity/channel.entity";

export class SendMessageDto {
	readonly user: User;
	readonly channel: Channel;
	readonly content: string;
	readonly timestamp: Date;
}