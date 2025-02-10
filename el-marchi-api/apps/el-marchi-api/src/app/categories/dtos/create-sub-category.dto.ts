import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const CreateSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Subcategory name must have at least 1 character' })
    .max(100, { message: 'Subcategory name must be at most 100 characters long' }),
  categoryId: z.string().uuid({ message: 'Invalid category ID' }),
});

export class CreateSubCategoryDto extends createZodDto(CreateSubCategorySchema) {}

export type CreateSubCategoryType = z.infer<typeof CreateSubCategorySchema>;
export { CreateSubCategorySchema };
