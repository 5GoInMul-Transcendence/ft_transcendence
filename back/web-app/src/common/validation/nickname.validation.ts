import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsNicknameConstraint implements ValidatorConstraintInterface {
  private readonly pattern: RegExp = /^[A-Za-z0-9]{2,12}$/;

  validate(nickname: unknown): boolean {
    return typeof nickname === 'string' && this.pattern.test(nickname);
  }

  defaultMessage(): string {
    return '유효하지 않은 닉네임입니다.';
  }
}

export function IsNickname(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      async: false,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNicknameConstraint,
      constraints: [],
    });
  };
}
