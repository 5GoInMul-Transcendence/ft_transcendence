import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementTableProvider } from './table/achievement-table.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  providers: [AchievementService, AchievementTableProvider],
})
export class AchievementModule {}
