import { User } from "../user.entity";

export class CreateMemberUserDto { // 영문, 숫자, 길이 체크 pipe
  public id: string;
  public password: string;
  public user: User;
};