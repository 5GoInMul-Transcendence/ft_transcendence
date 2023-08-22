import { Controller, Get, Param, Session } from '@nestjs/common';
import { GetUserProfileByNicknameReqDto } from './dto/get-user-profile-by-nickname-req.dto';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { FindUserByNicknameDto } from '../memoryuser/dto/find-user-by-nickname.dto';
import { GameRecordDto } from '../me/dto/game-record.dto';
import { GetUserProfileByNicknameResDto } from './dto/get-user-profile-by-nickname-res.dto';
import { Builder } from 'builder-pattern';
import { MemoryUserService } from '../memoryuser/memory-user.service';

@Controller('user')
export class UserController {
  constructor(private memoryUserService: MemoryUserService) {}

  @Get(':nickname')
  getUserProfileByNickname(
    @Session() session,
    @Param() dto: GetUserProfileByNicknameReqDto,
  ) {
    const me = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(session.userId).build(),
    );
    const findUser = this.memoryUserService.findUserByNickname(
      Builder(FindUserByNicknameDto).nickname(dto.nickname).build(),
    );

    const gameRecodeDto = Builder(GameRecordDto)
      .win(10)
      .loss(10)
      .ladderLevel(10)
      .achievement(['0123456789abcdef', '0123456789abcdef'])
      .build();
    return Builder(GetUserProfileByNicknameResDto)
      .id(findUser.id)
      .nickname(findUser.nickname)
      .avatar(findUser.avatar)
      .gameRecord(gameRecodeDto)
      .isFriend(me.friends.has(findUser.id))
      .isBlock(me.blocks.has(findUser.id))
      .build();
  }
}
