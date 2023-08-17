import { UserStatus } from '../../users/enums/user-status.enum';

export class AddFriendResDto {
  readonly id: number;
  readonly nickname: string;
  readonly avatar: string;
  readonly status: UserStatus;
}
