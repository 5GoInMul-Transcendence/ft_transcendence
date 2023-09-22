import { IsValidatedChannelName } from "../pipes/channel-name.pipe";

export class CreatePublicChannelReqDto {
	@IsValidatedChannelName()
	readonly name: string;
};