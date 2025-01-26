import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { fromZodError } from 'zod-validation-error';
import { isZodDto } from '../dtos/zod-dto';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!isZodDto(metatype)) return value;

    const result = metatype.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: fromZodError(result.error).details,
      });
    }

    return result.data;
  }
}
