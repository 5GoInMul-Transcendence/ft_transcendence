import {
  Body,
  Controller,
  Get,
  Put,
  Session,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { GetUserProfileResDto } from './dto/get-user-profile-res.dto';
import { GameRecordDto } from './dto/game-record.dto';
import { GetUserProfileDetailsResDto } from './dto/get-user-profile-details-res.dto';
import { UpdateTwofactorReqDto } from './dto/update-twofactor-req.dto';
import { CheckAvailableTwofactorDto } from '../memoryuser/dto/check-available-twofactor.dto';
import { CheckDuplicateNicknameDto } from '../memoryuser/dto/check-duplicate-nickname.dto';
import { UpdateNicknameReqDto } from './dto/update-nickname-req.dto';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BroadcastFriendUpdateDto } from '../../friend/dto/broadcast-friend-update.dto';
import { FriendService } from '../../friend/friend.service';
import { FriendInfo } from '../../friend/friend-info';
import { LadderService } from '../../ladder/ladder.service';
import { AchievementService } from '../../achievement/achievement.service';
import { FindAchievementDto } from '../../achievement/dto/find-achievement.dto';
import { FindLadderDto } from '../../ladder/dto/find-ladder.dto';

@Controller('me')
export class MeController {
  constructor(
    private memoryUserService: MemoryUserService,
    private userService: UserService,
    private friendService: FriendService,
    private ladderService: LadderService,
    private achievementService: AchievementService,
  ) {}

  @Get()
  async getUserProfile(@Session() session) {
    const me = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(session.userId).build(),
    );
    const achievement = await this.achievementService.findAchievementByUserId(
      Builder(FindAchievementDto).userId(session.userId).build(),
    );
    const ladder = await this.ladderService.findLadderByUserId(
      Builder(FindLadderDto).userId(session.userId).build(),
    );

    const gameRecordDto = Builder(GameRecordDto)
      .win(ladder.win)
      .lose(ladder.lose)
      .ladderLevel(ladder.level)
      .achievement(achievement.achievements)
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
  @Put('avatar')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(@Session() session, @UploadedFile() file: Express.Multer.File) {
    this.userService.updateUser(
      Builder(UpdateUserDto)
        .userId(session.userId)
        .avatar(file.filename)
        .build(),
    );
    this.friendService.broadcastFriendUpdate(
      Builder(BroadcastFriendUpdateDto)
        .userId(session.userId)
        .friendInfo(Builder(FriendInfo).avatar(file.filename).build())
        .build(),
    );
  }
}
