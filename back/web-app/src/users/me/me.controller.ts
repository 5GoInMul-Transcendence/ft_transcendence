import { Body, Controller, Get, Param, Put, Session } from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserProfileResDto } from './dto/get-user-profile-res.dto';
import { GameRecordDto } from './dto/game-record.dto';
import { GetUserProfileDetailsResDto } from './dto/get-user-profile-details-res.dto';
import { GetUserProfileByNicknameReqDto } from './dto/get-user-profile-by-nickname-req.dto';
import { FindUserByNicknameDto } from '../memoryuser/dto/find-user-by-nickname.dto';
import { GetUserProfileByNicknameResDto } from './dto/get-user-profile-by-nickname-res.dto';
import { UpdateTwofactorReqDto } from './dto/update-twofactor-req.dto';
import { CheckAvailableTwofactorDto } from '../memoryuser/dto/check-available-twofactor.dto';
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

    return Builder(GetUserProfileDetailsResDto)
      .id(me.id)
      .nickname(me.nickname)
      .avatar(me.avatar)
      .mail(me.mail)
      .phone(me.phone)
      .twoFactor(me.twoFactor)
      .build();
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

  @Put('twofactor')
  updateTwoFactor(@Session() session, @Body() dto: UpdateTwofactorReqDto) {
    this.memoryUserService.checkAvailableTwoFactor(
      Builder(CheckAvailableTwofactorDto)
        .userId(session.userId)
        .twoFactor(dto.twofactor)
        .build(),
    );
    this.userService.updateUser(
      Builder(UpdateUserDto)
        .userId(session.userId)
        .twoFactor(dto.twofactor)
        .build(),
    );
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
