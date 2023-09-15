import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Session,
} from '@nestjs/common';
import { GetUserProfileByNicknameReqDto } from './dto/get-user-profile-by-nickname-req.dto';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { FindUserByNicknameDto } from '../memoryuser/dto/find-user-by-nickname.dto';
import { GameRecordDto } from '../me/dto/game-record.dto';
import { GetUserProfileByNicknameResDto } from './dto/get-user-profile-by-nickname-res.dto';
import { Builder } from 'builder-pattern';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { AchievementService } from '../../achievement/achievement.service';
import { LadderService } from '../../ladder/ladder.service';
import { ApiResponseForm } from '../../common/response/api-response-form';
import { RedirectResource } from '../../common/response/redirect-resource.enum';
import { Response } from 'express';
import { FindLadderDto } from '../../ladder/dto/find-ladder.dto';
import { FindAchievementDto } from '../../achievement/dto/find-achievement.dto';
@Controller('user')
export class UserController {
  constructor(
    private memoryUserService: MemoryUserService,
    private ladderService: LadderService,
    private achievementService: AchievementService,
  ) {}

  @Get(':nickname')
  async getUserProfileByNickname(
    @Session() session: Record<string, any>,
    @Res() res: Response,
    @Param() dto: GetUserProfileByNicknameReqDto,
  ) {
    const me = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(session.userId).build(),
    );

    if (me.nickname === dto.nickname) {
      res.status(HttpStatus.FOUND);
      return ApiResponseForm.redirect(RedirectResource.MYPROFILE);
    }

    const findUser = this.memoryUserService.findUserByNickname(
      Builder(FindUserByNicknameDto).nickname(dto.nickname).build(),
    );
    const ladder = await this.ladderService.findLadderByUserId(
      Builder(FindLadderDto).userId(findUser.id).build(),
    );
    const achievement = await this.achievementService.findAchievementByUserId(
      Builder(FindAchievementDto).userId(findUser.id).build(),
    );

    const gameRecodeDto = Builder(GameRecordDto)
      .ladderLevel(ladder.level)
      .win(ladder.win)
      .lose(ladder.lose)
      .achievement(achievement.achievements)
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
