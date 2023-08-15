import { Body, Controller, Get, Put, Session } from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserProfileResDto } from './dto/get-user-profile-res.dto';
import { GameRecordDto } from './dto/game-record.dto';
// import { GetUserProfileDetailsResDto } from './dto/get-user-profile-details-res.dto';

@Controller('me')
export class MeController {
  constructor(private memoryUserService: MemoryUserService) {}

  @Get()
  getUserProfile(@Session() session) {
    const me = this.memoryUserService.findUser(
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
    const me = this.memoryUserService.findUser(
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
}
