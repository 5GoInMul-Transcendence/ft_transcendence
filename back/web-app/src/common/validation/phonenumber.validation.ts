import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  private readonly pattern: RegExp = /^010\d{8}$/;

  validate(phoneNumber: unknown): boolean {
    return typeof phoneNumber === 'string' && this.pattern.test(phoneNumber);
  }

  defaultMessage(): string {
    return '핸드폰 형식이 올바르지 않습니다.';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      async: false,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneNumberConstraint,
      constraints: [],
    });
  };
}
