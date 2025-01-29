import { z } from 'zod';
import { createZodDto } from '../../common/dtos/zod-dto';

const RefreshTokenSchema = z.object({
  token: z.string().min(1, { message: 'Refresh Token is required' }),
});

export class RefreshTokensDto extends createZodDto(RefreshTokenSchema) {}

export type RefreshTokensType = z.infer<typeof RefreshTokenSchema>;
export { RefreshTokenSchema };
