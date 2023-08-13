import { Body, Controller, Get, Put, Session } from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserResDto } from './dto/get-user-res.dto';
import { GameRecordDto } from './dto/game-record.dto';

@Controller('me')
export class MeController {
  constructor(private memoryUserService: MemoryUserService) {}

  @Get()
  getUser(@Session() session) {
    const me = this.memoryUserService.findUser(
      Builder(FindUserDto).userId(session.userId).build(),
    );

    const gameRecordDto = Builder(GameRecordDto)
      .win(10)
      .loss(10)
      .ladderLevel(10)
      .achievement(['0123456789abcdef', '0123456789abcdef'])
      .build();
    return Builder(GetUserResDto)
      .id(me.id)
      .avatar(me.avatar)
      .nickname(me.nickname)
      .gameRecord(gameRecordDto)
      .build();
  }
}
