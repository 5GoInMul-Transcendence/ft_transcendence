import { AchievementType } from '../enums/achievement-type.enum';

export class UpdateAchievementDto {
  userId: number;
  achievementType: AchievementType;
}
