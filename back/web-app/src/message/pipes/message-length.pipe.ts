import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsValidatedMessageConstraint implements ValidatorConstraintInterface {
  validate(message: string): boolean {
		return message.length < 256;
  }

  defaultMessage(): string {
    return '메시지 길이는 255자가 넘을 수 없습니다.';
  }
}

export function IsValidatedMessage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      async: false,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidatedMessageConstraint,
      constraints: [],
    });
  };
}
