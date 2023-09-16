import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ladder } from './entities/ladder.entity';
import { Repository } from 'typeorm';
import { FindLadderDto } from './dto/find-ladder.dto';
import { LadderLevelTable } from './ladder-level-table';
import { UpdateLadderDto } from './dto/update-ladder.dto';

@Injectable()
export class LadderService {
  constructor(
    @InjectRepository(Ladder) private ladderRepository: Repository<Ladder>,
  ) {}

  async findLadderByUserId(dto: FindLadderDto): Promise<Ladder> {
    const ladder = await this.ladderRepository.findOneBy({
      userId: dto.userId,
    });

    if (!ladder) {
      throw new HttpException('래더 정보를 찾을 수 없습니다.', HttpStatus.OK);
    }

    return ladder;
  }

  async updateLadder(dto: UpdateLadderDto) {
    const ladder = await this.ladderRepository.findOneBy({
      userId: dto.userId,
    });

    if (!ladder) {
      throw new HttpException('래더 정보를 찾을 수 없습니다.', HttpStatus.OK);
    }

    if (dto.isWin) {
      ladder.win += 1;

      const updatedPoint = ladder.win - ladder.lose;

      if (updatedPoint >= LadderLevelTable[ladder.level].nextLevelPoint) {
        ladder.level += 1;
      }
    }

    if (dto.isWin == false) {
      ladder.lose += 1;

      const updatedPoint = ladder.win - ladder.lose;
      const prevLevel = Math.max(1, ladder.level - 1);

      if (updatedPoint < LadderLevelTable[prevLevel].nextLevelPoint) {
        ladder.level = prevLevel;
      }
    }

    this.ladderRepository.save(ladder);
  }
}
