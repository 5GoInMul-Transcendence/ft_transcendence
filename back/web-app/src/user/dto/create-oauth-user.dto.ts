import { User } from "../user.entity";

export class CreateOauthUserDto {
  public user: User;
  public profileId: number;
};