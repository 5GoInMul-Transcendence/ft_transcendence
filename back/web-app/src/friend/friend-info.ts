import { UserStatus } from '../users/enums/user-status.enum';

export class FriendInfo {
  id: number;
  nickname: string;
  avatar: string;
  status: UserStatus;
}
