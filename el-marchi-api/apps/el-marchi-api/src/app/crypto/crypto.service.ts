import { Injectable } from '@nestjs/common';
import { createHash, pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2P = promisify(pbkdf2);

@Injectable()
export class CryptoService {
  private readonly iterations = 100000;
  private readonly keylen = 64;
  private readonly digest = 'sha512';

  async hashToken(token: string): Promise<string> {
    return createHash('sha256').update(token).digest('hex');
  }

  async verifyToken(token: string, storedHash: string): Promise<boolean> {
    const computedHash = await this.hashToken(token);
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }
    return timingSafeEqual(computedBuffer, storedBuffer);
  }

  async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(32).toString('hex');
    const hash = await this.generateHash(password, salt);
    return { hash, salt };
  }

  async verifyPassword(
    password: string,
    storedHash: string,
    storedSalt: string,
  ): Promise<boolean> {
    const computedHash = await this.generateHash(password, storedSalt);
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }
    return timingSafeEqual(computedBuffer, storedBuffer);
  }

  private async generateHash(password: string, salt: string): Promise<string> {
    const derivedKey = await pbkdf2P(
      password,
      salt,
      this.iterations,
      this.keylen,
      this.digest,
    );
    return derivedKey.toString('hex');
  }
}
