import { IsValidatedChannelName } from "../pipes/channel-name.pipe";
import { IsValidatedChannelPassword } from "../pipes/channel-password.pipe";

export class CreateProtectedChannelReqDto {
	@IsValidatedChannelName()
	readonly name: string;

	@IsValidatedChannelPassword()
	readonly password: string;
};