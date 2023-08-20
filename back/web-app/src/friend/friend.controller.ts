import { Body, Controller, Post, Session } from '@nestjs/common';
import { AddFriendReqDto } from './dto/add-friend-req.dto';
import { AddFriendDto } from './dto/add-friend.dto';
import { Builder } from 'builder-pattern';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Post()
  addFriend(@Session() session, @Body() dto: AddFriendReqDto) {
    return this.friendService.addFriend(
      Builder(AddFriendDto)
        .userId(session.userId)
        .nickname(dto.nickname)
        .build(),
    );
  }
}
