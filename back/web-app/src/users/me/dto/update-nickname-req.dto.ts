import { IsNickname } from '../../../common/validation/nickname.validation';

export class UpdateNicknameReqDto {
  @IsNickname()
  readonly nickname: string;
}
