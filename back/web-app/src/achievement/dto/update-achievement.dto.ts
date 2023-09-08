import { AchievementType } from '../enums/achievement-type.enum';

export class UpdateAchievementDto {
  readonly userId: number;
  readonly achievementType: AchievementType;
}
