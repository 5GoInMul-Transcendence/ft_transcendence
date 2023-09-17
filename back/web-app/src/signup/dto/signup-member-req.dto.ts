import { IsAlphanumeric, IsAscii, Length } from 'class-validator';

export class SignupMemberRepDto {
  @Length(2, 12, { message: '아이디는 2글자 이상 12글자 이하만 입력가능합니다.' })
  @IsAlphanumeric('en-US', { message: '아이디는 알파벳과 숫자만 입력가능합니다.' })
  public id: string;

  @Length(8, 15, { message: '패스워드는는 8글자 이상 15글자 이하만 가능합니다.' })
  @IsAscii({ message: '패스워드 형식이 올바르지 않습니다.' })
  public password: string;
}
