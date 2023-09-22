import { IsValidatedChannelPassword } from "../pipes/channel-password.pipe";

export class AuthenticatePasswordReqDto {
	@IsValidatedChannelPassword()
	readonly password: string;
};