import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: extendApi(z.coerce.number().int().positive().default(3000), {
    description: 'Port to listen on',
    example: 3000,
  }),
  HOSTNAME: extendApi(z.string().default('0.0.0.0'), {
    description: 'Host to bind to',
    example: '0.0.0.0',
  }),
  MODE: extendApi(
    z.enum(['development', 'production']).default('development'),
    {
      description: 'Application mode',
    },
  ),
  NODE_ENV: extendApi(
    z.enum(['development', 'production', 'test']).default('development'),
    { description: 'Node environment' },
  ),
  DB_HOSTNAME: extendApi(z.string().default('localhost'), {
    description: 'Database host',
    example: 'localhost',
  }),
  DB_PORT: extendApi(z.coerce.number().int().positive().default(5432), {
    description: 'Database port',
    example: 5432,
  }),
  DB_USERNAME: extendApi(z.string().default('admin'), {
    description: 'Database username',
    example: 'admin',
  }),
  DB_PASSWORD: extendApi(z.string().default('password'), {
    description: 'Database password',
    example: 'password',
  }),
  DB_NAME: extendApi(z.string().default('ElMarchi'), {
    description: 'Database name',
    example: 'ElMarchi',
  }),
  JWT_SECRET: extendApi(
    z.string({ message: 'You have to Provide JWT Secret.' }).min(12, {
      message: 'For Security Reasons JWT_Secret must be longer than 12.',
    }),
  ),
});

export type EnvConfig = z.infer<typeof envSchema>;
