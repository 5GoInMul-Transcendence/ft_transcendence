import { User } from "src/users/user/entities/user.entity";
import { Channel } from "../entities/channel.entity";

export class CreateLinkChannelToUserReqDto {
	readonly user: User;
	readonly channel: Channel;
	readonly role: string;
};