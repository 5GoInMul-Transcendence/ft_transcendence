import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { Injectable } from '@nestjs/common';
import { MainUser } from './main-user';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { SetUserDto } from './dto/set-user.dto';
import { Builder } from 'builder-pattern';
import { BroadcastMessageDto } from './dto/broadcast-message.dto';
import { ApiResponseForm } from '../common/response/api-response-form';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class MainUserService {
  private mainUsers: Map<number, MainUser>;

  constructor(private memoryUserService: MemoryUserService) {
    this.mainUsers = new Map<number, MainUser>();
  }

  setUser(dto: SetUserDto) {
    this.mainUsers.set(
      dto.userId,
      Builder(MainUser).userId(dto.userId).client(dto.client).build(),
    );
  }

  deleteUser(dto: DeleteUserDto) {
    this.mainUsers.delete(dto.userId);
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
}
