import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Repository } from 'typeorm';
import { AchievementTableProvider } from './table/achievement-table.provider';
import * as fs from 'fs';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementGrade } from './achievement-grade';

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

  async findAchievementByUserId(dto: any) {
    const userAchievement = await this.achievementRepository.findOneBy({
      userId: dto.userId,
    });

    if (!userAchievement) {
      throw new HttpException('유저의 업적을 찾을 수 없습니다.', HttpStatus.OK);
    }

    return userAchievement;
  }

  async updateAchievement(dto: UpdateAchievementDto) {
    const userAchievement = await this.achievementRepository.findOneBy({
      userId: dto.userId,
    });
    /* 보상 타입에 맞는 테이블을 가져옵니다. */
    const achievementTable = this.achievementTables.get(dto.achievementType);

    /* 보상 정보를 조회할 수 없는 경우 그대로 리턴합니다.*/
    if (!userAchievement || !achievementTable) {
      return;
    }

    /* 보상 타입에 맞는 유저의 정보(레벨, 포인터)를 가져옵니다. */
    const userAchievementGrade: AchievementGrade =
      userAchievement[achievementTable.entityProperty];
    userAchievementGrade.point += 1;

    /* 유저 레벨에 맞는 보상 조건을 가져오고
       조건에 따라 유저의 정보를 업데이트합니다. */
    const element = achievementTable.elements[userAchievementGrade.level];

    if (userAchievementGrade.point >= element.nextLevelPoint) {
      userAchievementGrade.level += 1;
      userAchievement.achievements.push(element.awardId);
    }

    this.achievementRepository.save(userAchievement);
  }
}
