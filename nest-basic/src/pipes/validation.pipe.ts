import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ObjectSchema } from 'joi'; // 👈 note the "type" keyword

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      throw new BadRequestException(
        error.details.map((d) => d.message).join(', '),
      );
    }
    return value;
  }
}
