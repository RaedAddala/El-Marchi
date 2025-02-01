import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const UpdateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name must have at least 1 character' })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last name must have at least 1 character' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  birthDate: z.coerce.date().optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
export { UpdateUserSchema };
