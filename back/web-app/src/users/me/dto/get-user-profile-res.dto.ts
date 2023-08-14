import { GameRecordDto } from './game-record.dto';

export class GetUserProfileResDto {
  readonly id: number;
  readonly nickname: string;
  readonly avatar: string;
  readonly gameRecord: GameRecordDto;
}
