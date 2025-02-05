import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const CreateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  birthDate: z.coerce.date(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(60, { message: 'Password must be at most 60 characters long' }),
  phoneNumber: z
    .string()
    .min(8, { message: 'Phone Number must be at least 8 characters long' })
    .regex(/^\+?\d+$/, {
      message: 'Phone Number must be numeric and may start with +',
    }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export type CreateUserType = z.infer<typeof CreateUserSchema>;
export { CreateUserSchema };
