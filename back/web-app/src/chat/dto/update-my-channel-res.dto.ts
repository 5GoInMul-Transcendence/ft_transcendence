export class ChatRecentMessage {
  readonly id: number;
  readonly content: string;
  readonly nickname: string;
  readonly avatar: string;
}

export class UpdateMyChannelResDto {
  readonly id: number;
  readonly recentMessage: ChatRecentMessage;
}
