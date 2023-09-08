import {
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Repository } from 'typeorm';
import { AchievementTableProvider } from './table/achievement-table.provider';
import * as fs from 'fs';

@Injectable()
export class AchievementService implements OnModuleInit {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    private achievementTables: AchievementTableProvider,
  ) {}

  async onModuleInit(): Promise<void> {
    this.achievementTables.forEach((achievementTable) => {
      for (const element of achievementTable.elements.values()) {
        const awardImage = 'public/achievement/' + element.awardId;

        if (!fs.existsSync(awardImage)) {
          throw new ServiceUnavailableException(
            `업적 이미지를 업데이트 바랍니다! (path: ${awardImage})`,
          );
        }
      }
    });
  }
}
