import { IsNickname } from '../../common/validation/nickname.validation';

export class AddFriendReqDto {
  @IsNickname()
  nickname: string;
}
