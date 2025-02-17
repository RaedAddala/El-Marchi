import {z} from "zod";
import {createZodDto} from "@anatine/zod-nestjs";

const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Category name must have at least 1 character' })
    .max(100, { message: 'Category name must be at most 100 characters long' }),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
export { CreateCategorySchema };
