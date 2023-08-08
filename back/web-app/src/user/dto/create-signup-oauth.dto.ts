import { User } from "../user.entity";

export class CreateSignupOauthDto {
  public user: User;
  public profileId: number;
};