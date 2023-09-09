import { Builder } from 'builder-pattern';
import { Achievement } from '../../entities/achievement.entity';
import { AchievementElement } from '../achievement-element';
import { AchievementTable } from '../achievement-table';

export const gameWinTable: AchievementTable = new AchievementTable(
  JSON.stringify(Achievement.prototype.gameWin),
  [
    Builder(AchievementElement).level(0).nextLevelPoint(3).awardId('1001').build(),
    Builder(AchievementElement).level(1).nextLevelPoint(5).awardId('1002').build(),
    Builder(AchievementElement).level(2).nextLevelPoint(10).awardId('1003').build(),
    Builder(AchievementElement).level(3).nextLevelPoint(Number.MAX_SAFE_INTEGER).awardId('1004').build(),
  ],
);
