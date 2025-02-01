import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const ChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'newPassword must be at least 8 characters long' }),
  oldPassword: z
    .string()
    .min(8, { message: 'oldPassword must be at least 8 characters long' }),
});

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) { }

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
export { ChangePasswordSchema };
