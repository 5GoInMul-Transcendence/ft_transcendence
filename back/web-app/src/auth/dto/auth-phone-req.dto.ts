import { IsPhoneNumber } from '../../common/validation/phonenumber.validation';

export class AuthPhoneReqDto {
  @IsPhoneNumber()
  phone: string;
}
