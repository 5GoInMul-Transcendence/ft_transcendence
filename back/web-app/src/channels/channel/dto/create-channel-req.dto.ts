export class CreateChannelReqDto {
	readonly name: string;
	readonly mode: string;
	readonly password: string | null;
};