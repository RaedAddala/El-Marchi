import { Injectable } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import { readFileSync } from 'fs';

@Injectable()
export class JwtconfigService {
  private readonly accessPublicKey: string;
  private readonly accessPrivateKey: string;
  private readonly refreshPublicKey: string;
  private readonly refreshPrivateKey: string;

  constructor() {
    this.accessPublicKey = readFileSync('./keys/access_public.pem', 'utf8');
    this.accessPrivateKey = readFileSync('./keys/access_private.pem', 'utf8');
    this.refreshPublicKey = readFileSync('./keys/refresh_public.pem', 'utf8');
    this.refreshPrivateKey = readFileSync('./keys/refresh_private.pem', 'utf8');
  }

  getJwtConfig() {
    return {
      algorithm: 'ES512',
      access: {
        privateKey: this.accessPrivateKey,
        publicKey: this.accessPublicKey,
        expiresIn: '15m',
      },
      refresh: {
        privateKey: this.refreshPrivateKey,
        publicKey: this.refreshPublicKey,
        expiresIn: '7d',
      },
    };
  }
}

export function jwtFactory(jwtconfig: JwtconfigService) {
  return {
    publicKey: jwtconfig.getJwtConfig().access.publicKey,
    privateKey: jwtconfig.getJwtConfig().access.privateKey,
    signOptions: {
      algorithm: 'EdDSA',
      expiresIn: jwtconfig.getJwtConfig().access.expiresIn,
    },
    verifyOptions: { algorithms: ['EdDSA'] },
  } as JwtModuleOptions;
}
