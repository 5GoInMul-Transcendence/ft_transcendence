import { AchievementType } from '../enums/achievement-type.enum';
import { Injectable } from '@nestjs/common';
import { AchievementTable } from './achievement-table';
import { gameWinTable } from './object/gaem-win-table';

@Injectable()
export class AchievementTableProvider extends Map<
  AchievementType,
  AchievementTable
> {
  constructor() {
    super();

    this.set(AchievementType.GAME_WIN, gameWinTable);
  }
}
