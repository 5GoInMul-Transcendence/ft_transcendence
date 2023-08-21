import { User } from "../entities/user.entity";

export class CreateMemberUserDto { // 영문, 숫자, 길이 체크 pipe
  public user: User;
  public id: string;
  public password: string;
};