import { ChatEvent } from '../enums/chat-event.enum';
import { Channel } from '../../channels/channel/entities/channel.entity';

export class UpdateMyChannelDto {
  readonly userId: number;
  readonly event: ChatEvent.AddMyChannel | ChatEvent.DeleteMyChannel;
  readonly channel: Channel;
}
