import { Injectable } from '@nestjs/common';
import { MainUser } from './main-user';
import { FindUserDto } from '../../users/memoryuser/dto/find-user.dto';
import { AddMainUserDto } from '../dto/add-main-user.dto';
import { Builder } from 'builder-pattern';
import { BroadcastMessageDto } from '../dto/broadcast-message.dto';
import { ApiResponseForm } from '../../common/response/api-response-form';
import { DeleteMainUserDto } from '../dto/delete-main-user.dto';
import { UpdateMainUserDto } from '../dto/update-main-user.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { MainUserStatus } from '../enums/main-user-status.enum';

@Injectable()
export class MainUserService {
  private mainUsers: Map<number, MainUser>;

  constructor() {
    this.mainUsers = new Map<number, MainUser>();
  }

  addUser(dto: AddMainUserDto) {
    this.mainUsers.set(
      dto.userId,
      Builder(MainUser)
        .userId(dto.userId)
        .client(dto.client)
        .status(MainUserStatus.DEFAULT)
        .build(),
    );
  }

  deleteUser(dto: DeleteMainUserDto) {
    this.mainUsers.delete(dto.userId);
  }

  updateUser(dto: Partial<UpdateMainUserDto> & { userId: number }) {
    const mainUser = this.mainUsers.get(dto.userId);

    Object.keys(dto).forEach((key) => {
      mainUser[key] = dto[key];
    });
  }

  findUserByUserId(dto: FindUserDto) {
    return this.mainUsers.get(dto.userId);
  }

  broadcastMessage(dto: BroadcastMessageDto) {
    for (const targetId of dto.target) {
      const target = this.mainUsers.get(targetId);

      if (!target) {
        continue;
      }

      target.client.emit(dto.event, ApiResponseForm.ok(dto.data));
    }
  }

  sendMessage(dto: SendMessageDto) {
    const user = this.mainUsers.get(dto.userId);

    if (!user) {
      return;
    }

    user.client.emit(dto.event, dto.data);
  }
}
