import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TechnologyDto } from './technology.dto';

@ValidatorConstraint({ name: 'isRequiredWhenPublished', async: false })
export class IsRequiredWhenPublishedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as TechnologyDto;

    if (!object.isPublished) {
      return true;
    }

    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return !!value;
  }

  defaultMessage(args: ValidationArguments): string {
    const property = args.property;
    return `${property} is required when technology is published`;
  }
}

export function IsRequiredWhenPublished(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRequiredWhenPublishedConstraint,
    });
  };
}
