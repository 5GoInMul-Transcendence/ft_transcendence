import { User } from "../user/entities/user.entity";

export class CreateOauthUserDto {
  public user: User;
  public profileId: number;
};