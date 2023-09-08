import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ladder } from './entities/ladder.entity';
import { Repository } from 'typeorm';
import { FindLadderDto } from './dto/find-ladder.dto';

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
}
