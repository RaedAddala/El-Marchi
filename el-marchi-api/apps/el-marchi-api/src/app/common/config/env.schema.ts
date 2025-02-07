import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export type JWTAlgorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512";

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

  REDIS_HOSTNAME: extendApi(z.string().default('localhost'), {
    description: 'REDIS host',
    example: 'localhost',
  }),
  REDIS_PORT: extendApi(z.coerce.number().int().positive().default(6379), {
    description: 'REDIS port',
    example: 6379,
  }),
  REDIS_PASSWORD: extendApi(z.string().default('p@ssw0rd_r3kwired'), {
    description: 'REDIS password',
    example: 'p@ssw0rd_r3kwired',
  }),
  ACCESS_TOKEN_EXPIRATION_IN_MINUTES: extendApi(
    z.coerce.number().int().positive().default(15),
    {
      description: 'Access token expiration time in minutes',
      example: 15,
    },
  ),
  REFRESH_TOKEN_EXPIRATION_IN_DAYS: extendApi(
    z.coerce.number().int().positive().default(7),
    {
      description: 'Refresh token expiration time in days',
      example: 7,
    },
  ),
  JWT_ALGORITHM: extendApi(
    z.enum([
      "HS256", "HS384", "HS512",
      "RS256", "RS384", "RS512",
      "ES256", "ES384", "ES512",
      "PS256", "PS384", "PS512"
    ] as const).default("ES256"),
    {
      description: 'JWT signing algorithm',
      example: 'ES256',
    },
  ),
});

export type EnvConfig = z.infer<typeof envSchema>;
