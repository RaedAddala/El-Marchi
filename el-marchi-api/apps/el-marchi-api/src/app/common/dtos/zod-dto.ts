import { ZodSchema, z } from 'zod';
import { extendApi, generateSchema } from '@anatine/zod-openapi';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { fromZodError } from 'zod-validation-error';

export interface ZodDtoStatic<T extends ZodSchema> {
  schema: T;
  new (): z.infer<T>;
}

export function createZodDto<T extends ZodSchema>(schema: T): ZodDtoStatic<T> {
  const openApiSchema = extendApi(schema);
  const swaggerSchema = generateSchema(openApiSchema);

  class BaseDto {
    static schema = openApiSchema;

    constructor(data: unknown) {
      const result = openApiSchema.safeParse(data);
      if (!result.success) {
        throw fromZodError(result.error);
      }
      Object.assign(this, result.data);
    }
  }

  Object.entries(swaggerSchema.properties || {}).forEach(([key, prop]) => {
    const cleanProp = prop as Record<string, unknown>;
    const decorator = ApiProperty({
      ...cleanProp,
      required: swaggerSchema.required?.includes(key) ?? false,
    } as ApiPropertyOptions);
    decorator(BaseDto.prototype, key);
  });

  return BaseDto as ZodDtoStatic<T>;
}

export function isZodDto(metatype: unknown): metatype is ZodDtoStatic<ZodSchema> {
  return typeof metatype === 'function' && 'schema' in metatype;
}
