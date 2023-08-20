import { Body, Controller, Post, Get, Session } from '@nestjs/common';
import { AddFriendReqDto } from './dto/add-friend-req.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { Builder } from 'builder-pattern';
import { FriendService } from './friend.service';
import { GetFriendsInfoDto } from './dto/get-friends-info.dto';

@Controller()
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post('friend')
  addFriend(@Session() session, @Body() dto: AddFriendReqDto) {
    return this.friendService.addFriend(
      Builder(AddFriendDto)
        .userId(session.userId)
        .nickname(dto.nickname)
        .build(),
    );
  }

  @Get('friendlist')
  getFriendsInfo(@Session() session) {
    return this.friendService.getFriendsInfo(
      Builder(GetFriendsInfoDto).userId(session.userId).build(),
    );
  }
}
