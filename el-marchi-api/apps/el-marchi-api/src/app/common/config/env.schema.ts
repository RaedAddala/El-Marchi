import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';

export const envSchema = z.object({
  PORT: extendApi(z.coerce.number().int().positive().default(3000), {
    description: 'Port to listen on',
    example: 3000,
  }),
  HOSTNAME: extendApi(z.string().default('0.0.0.0'), {
    description: 'Host to bind to',
    example: '0.0.0.0',
  }),
  MODE: extendApi(z.enum(['development', 'production']).default('development'), {
    description: 'Application mode',
  }),
  NODE_ENV: extendApi(
    z.enum(['development', 'production', 'test']).default('development'),
    { description: 'Node environment' }
  ),
});

export type EnvConfig = z.infer<typeof envSchema>;
