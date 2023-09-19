export class ChatRecentMessage {
  readonly id: number;
  readonly nickname: string;
  readonly content: string;
}

export class UpdateMyChannelResDto {
  readonly id: number;
  readonly recentMessage: ChatRecentMessage;
}
