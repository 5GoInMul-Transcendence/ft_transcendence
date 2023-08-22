import { Body, Controller, Get, Param, Put, Session } from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserProfileResDto } from './dto/get-user-profile-res.dto';
import { GameRecordDto } from './dto/game-record.dto';
import { CheckDuplicateNicknameDto } from '../memoryuser/dto/check-duplicate-nickname.dto';
 import { UpdateNicknameReqDto } from './dto/update-nickname-req.dto';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('me')
export class MeController {
  constructor(
    private memoryUserService: MemoryUserService,
    private userService: UserService,
  ) {}

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

  @Put('nickname')
  updateNickname(@Session() session, @Body() dto: UpdateNicknameReqDto) {
    this.memoryUserService.checkDuplicateNickname(
      Builder(CheckDuplicateNicknameDto).nickname(dto.nickname).build(),
    );

    this.userService.updateUser(
      Builder(UpdateUserDto)
        .userId(session.userId)
        .nickname(dto.nickname)
        .build(),
    );
  }
}
