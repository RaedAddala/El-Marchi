import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(crypto.pbkdf2);

@Injectable()
export class CryptoService {
  private readonly iterations = 100000;
  private readonly keylen = 64;
  private readonly digest = 'sha512';

  async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = await this.generateHash(password, salt);
    return { hash, salt };
  }

  async verifyPassword(
    password: string,
    storedHash: string,
    storedSalt: string,
  ): Promise<boolean> {
    const hash = await this.generateHash(password, storedSalt);
    return storedHash === hash;
  }

  private async generateHash(password: string, salt: string): Promise<string> {
    const derivedKey = await pbkdf2(
      password,
      salt,
      this.iterations,
      this.keylen,
      this.digest,
    );
    return derivedKey.toString('hex');
  }
}
