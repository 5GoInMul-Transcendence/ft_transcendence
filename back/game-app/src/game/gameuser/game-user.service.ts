import { Injectable } from '@nestjs/common';
import { GameUser } from './game-user';
import { GameUserStatus } from '../enums/game-user-status.enum';
import { Builder } from 'builder-pattern';
import { AddGameUserDto } from './dto/add-game-user.dto';
import { DeleteGameUserDto } from './dto/delete-game-user.dto';
import { UpdateGameUserDto } from './dto/update-game-user.dto';
import { FindGameUserByGameKeyDto } from './dto/find-game-user-by-game-key.dto';

@Injectable()
export class GameUserService {
  private gameUsers: Map<string, GameUser>;

  constructor() {
    this.gameUsers = new Map<string, GameUser>();
  }

  addUser(dto: AddGameUserDto) {
    this.gameUsers.set(
      dto.gameKey,
      Builder(GameUser)
        .gameKey(dto.gameKey)
        .client(dto.client)
        .status(GameUserStatus.DEFAULT)
        .build(),
    );
  }

  deleteUser(dto: DeleteGameUserDto) {
    this.gameUsers.delete(dto.gameKey);
  }

  updateUserStatus(dto: Partial<UpdateGameUserDto> & { gameKey: string }) {
    const user = this.gameUsers.get(dto.gameKey);

    if (!user) {
      return;
    }

    Object.keys(dto).forEach((key) => {
      user[key] = dto[key];
    });
  }

  findUserByGameKey(dto: FindGameUserByGameKeyDto) {
    return this.gameUsers.get(dto.gameKey);
  }
}
