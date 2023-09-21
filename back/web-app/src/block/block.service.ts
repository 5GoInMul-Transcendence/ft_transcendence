import { Injectable } from '@nestjs/common';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { Builder } from 'builder-pattern';
import { BlockDto } from './dto/block.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { DeleteUserBlockDto } from '../users/memoryuser/dto/delete-user-block.dto';
import { AddUserBlockDto } from '../users/memoryuser/dto/add-user-block.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private memoryUserService: MemoryUserService,
  ) {}

  block(dto: BlockDto): boolean {
    const { userId, blockUserId } = dto;

    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(userId).build(),
    );
    // BlockUser가 없을 경우 예외를 반환합니다.
    this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(blockUserId).build(),
    );

    let isBlocked;
    if (user.blocks.has(blockUserId)) {
      this.memoryUserService.deleteUserBlock(
        Builder(DeleteUserBlockDto)
          .userId(userId)
          .blockUserId(blockUserId)
          .build(),
      );
      isBlocked = false;
    } else {
      this.memoryUserService.addUserBlock(
        Builder(AddUserBlockDto)
          .userId(userId)
          .blockUserId(blockUserId)
          .build(),
      );
      isBlocked = true;
    }

    this.blockRepository.update(
      { userId },
      { blocks: Array.from(user.blocks) },
    );

    return isBlocked;
  }
}
