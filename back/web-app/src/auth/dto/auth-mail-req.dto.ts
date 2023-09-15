import { IsEmail } from 'class-validator';

export class AuthMailReqDto {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  mail: string;
}
