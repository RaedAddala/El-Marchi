import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const LoginCredentialsSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export class loginDto extends createZodDto(LoginCredentialsSchema) {}

export type LoginCredentialsType = z.infer<typeof LoginCredentialsSchema>;
export { LoginCredentialsSchema };
