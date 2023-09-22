import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsValidatedChannelNameConstraint implements ValidatorConstraintInterface {
  validate(name: string): boolean {
		return name.length < 33;
  }

  defaultMessage(): string {
    return '채널 이름은 32글자를 넘을 수 없습니다.';
  }
}

export function IsValidatedChannelName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      async: false,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidatedChannelNameConstraint,
      constraints: [],
    });
  };
}
