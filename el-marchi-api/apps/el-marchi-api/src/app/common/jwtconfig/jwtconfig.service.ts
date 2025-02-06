import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EnvConfig } from '../config/env.schema';

@Injectable()
export class JwtconfigService {
  private readonly accessPublicKey: string;
  private readonly accessPrivateKey: string;
  private readonly refreshPublicKey: string;
  private readonly refreshPrivateKey: string;

  private readonly algorithm: string;
  private readonly expiresInAccessToken: string;
  private readonly expiresInRefreshToken: string;

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
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

    this.algorithm = '1';
    this.expiresInAccessToken = '1';
    this.expiresInRefreshToken = '1';
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

export function jwtFactory(jwtconfig: JwtconfigService) {
  const config = jwtconfig.getJwtConfig();
  return {
    publicKey: config.access.publicKey,
    privateKey: config.access.privateKey,
    signOptions: {
      algorithm: config.algorithm,
      expiresIn: config.access.expiresIn,
    },
    verifyOptions: { algorithms: [config.algorithm] },
  } as JwtModuleOptions;
}
