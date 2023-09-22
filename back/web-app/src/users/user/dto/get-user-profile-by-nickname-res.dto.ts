import { GameRecordDto } from '../../me/dto/game-record.dto';

export class GetUserProfileByNicknameResDto {
  readonly id: number;
  readonly nickname: string;
  readonly avatar: string;
  readonly gameRecord: GameRecordDto;
  readonly isFriend: boolean;
  readonly isBlock: boolean;
}
