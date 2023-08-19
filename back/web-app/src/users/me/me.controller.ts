import { Controller, Get, Param, Session } from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserProfileResDto } from './dto/get-user-profile-res.dto';
import { GameRecordDto } from './dto/game-record.dto';
// import { GetUserProfileDetailsResDto } from './dto/get-user-profile-details-res.dto';
import { GetUserProfileByNicknameReqDto } from './dto/get-user-profile-by-nickname-req.dto';
import { FindUserByNicknameDto } from '../memoryuser/dto/find-user-by-nickname.dto';
import { GetUserProfileByNicknameResDto } from './dto/get-user-profile-by-nickname-res.dto';

@Controller('me')
export class MeController {
  constructor(private memoryUserService: MemoryUserService) {}

  @Get()
  getUserProfile(@Session() session) {
    const me = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(session.userId).build(),
    );

    const gameRecordDto = Builder(GameRecordDto)
      .win(10)
      .loss(10)
      .ladderLevel(10)
      .achievement(['0123456789abcdef', '0123456789abcdef'])
      .build();
    return Builder(GetUserProfileResDto)
      .id(me.id)
      .avatar(me.avatar)
      .nickname(me.nickname)
      .gameRecord(gameRecordDto)
      .build();
  }

  @Get('details')
  getUserProfileDetails(@Session() session) {
    const me = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(session.userId).build(),
    );

    // return Builder(GetUserProfileDetailsResDto)
    //   .id(me.id)
    //   .nickname(me.nickname)
    //   .avatar(me.avatar)
    //   .mail(me.mail)
    //   .phone(me.phone)
    //   .twoFactor(me.twoFactor)
    //   .build();
  }

  @Get('users/:nickname')
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
