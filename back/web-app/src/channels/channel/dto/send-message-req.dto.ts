import { IsValidatedMessage } from "src/message/pipes/message-length.pipe";

export class SendMessageReq {
	@IsValidatedMessage()
	readonly message: string;
}
