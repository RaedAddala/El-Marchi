import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';
import { User } from '../entities/user.entity';

const PaginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int({ message: 'Page must be an integer' })
    .min(1, { message: 'Page must be greater than or equal to 1' })
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int({ message: 'Limit must be an integer' })
    .min(1, { message: 'Limit must be greater than or equal to 1' })
    .default(10)
    .optional(),
  search: z
    .string({
      required_error: 'Search term is required if searchFields is provided',
      invalid_type_error: 'Search term must be a string',
    })
    .optional(),
  searchFields: z
    .array(z.string() as z.ZodType<keyof User>, {
      required_error:
        'Search fields must be provided if search term is present',
      invalid_type_error: 'Search fields must be valid User entity fields',
    })
    .optional(),
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}

export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>;
export { PaginationQuerySchema };
