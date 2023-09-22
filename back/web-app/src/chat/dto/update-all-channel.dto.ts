import { ChatEvent } from '../enums/chat-event.enum';
import { Channel } from '../../channels/channel/entities/channel.entity';

export class UpdateAllChannelDto {
  event: ChatEvent.AddAllChannel | ChatEvent.DeleteAllChannel;
  channel: Channel;
}
