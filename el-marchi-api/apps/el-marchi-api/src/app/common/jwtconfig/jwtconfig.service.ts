import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EnvConfig, JWT_ALGORITHM } from '../config/env.schema';

@Injectable()
export class JwtconfigService {
  private readonly accessPublicKey: string;
  private readonly accessPrivateKey: string;
  private readonly refreshPublicKey: string;
  private readonly refreshPrivateKey: string;

  private readonly algorithm: JWT_ALGORITHM;
  private readonly expiresInAccessToken: string;
  private readonly expiresInRefreshToken: string;

  constructor(config: ConfigService<EnvConfig, true>) {
    try {
      this.accessPublicKey = readFileSync(
        join(__dirname, '../../keys/access_public.pem'),
        'utf8',
      );
      this.accessPrivateKey = readFileSync(
        join(__dirname, '../../keys/access_private.pem'),
        'utf8',
      );
      this.refreshPublicKey = readFileSync(
        join(__dirname, '../../keys/refresh_public.pem'),
        'utf8',
      );
      this.refreshPrivateKey = readFileSync(
        join(__dirname, '../../keys/refresh_private.pem'),
        'utf8',
      );
    } catch (error) {
      throw new Error(`Failed to load JWT keys: ${error}`);
    }

    this.algorithm = config.get<EnvConfig['JWT_ALGORITHM']>('JWT_ALGORITHM');
    this.expiresInAccessToken =
      config.get<EnvConfig['ACCESS_TOKEN_EXPIRATION_IN_MINUTES']>(
        'ACCESS_TOKEN_EXPIRATION_IN_MINUTES',
      ) + 'm';
    this.expiresInRefreshToken =
      config.get<EnvConfig['REFRESH_TOKEN_EXPIRATION_IN_DAYS']>(
        'REFRESH_TOKEN_EXPIRATION_IN_DAYS',
      ) + 'd';
  }

  getJwtConfig() {
    return {
      algorithm: this.algorithm,
      access: {
        privateKey: this.accessPrivateKey,
        publicKey: this.accessPublicKey,
        expiresIn: this.expiresInAccessToken,
      },
      refresh: {
        privateKey: this.refreshPrivateKey,
        publicKey: this.refreshPublicKey,
        expiresIn: this.expiresInRefreshToken,
      },
    };
  }
}
