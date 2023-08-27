import { UserStatus } from '../../users/enums/user-status.enum';

export class UpdateFriendResDto {
  id: number;
  nickname: string;
  avatar: string;
  status: UserStatus;
}
