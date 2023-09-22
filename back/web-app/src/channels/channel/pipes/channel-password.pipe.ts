import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsValidatedChannelPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password)
      return true;
		return password.length >= 4 && password.length <= 12;
  }

  defaultMessage(): string {
    return '비밀번호는 4~12 길이를 갖습니다.';
  }
}

export function IsValidatedChannelPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      async: false,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidatedChannelPasswordConstraint,
      constraints: [],
    });
  };
}
