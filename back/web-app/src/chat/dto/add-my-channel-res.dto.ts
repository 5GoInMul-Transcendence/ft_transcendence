import { RecentMessage } from "src/channels/channel/dto/recent-message.dto";

export class AddMyChannelResDto {
  readonly id: number;
  readonly name: string;
  readonly recentMessage: RecentMessage;
}
