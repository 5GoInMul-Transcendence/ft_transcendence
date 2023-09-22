import { IsValidatedChannelPassword } from "../pipes/channel-password.pipe";

export class UpdateChannelSettingReqDto {
	readonly mode: string;

	@IsValidatedChannelPassword()
	readonly password: string;
}