import { User } from '../../users/user/entities/user.entity';
import { Channel } from '../../channels/channel/entities/channel.entity';

export class SendChatMessageDto {
  readonly user: User;
  readonly channel: Channel;
  readonly content: string;
}
