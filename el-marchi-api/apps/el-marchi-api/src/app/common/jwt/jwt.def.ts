import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { EnvConfig } from '../config/env.schema';

export function jwtFactory(config: ConfigService<EnvConfig, true>) {
  return {
    secret: config.get<EnvConfig['JWT_SECRET']>('JWT_SECRET'),
    signOptions: { algorithm: 'HS512' },
    verifyOptions: { algorithms: ['HS512'] },
  } as JwtModuleOptions;
}
