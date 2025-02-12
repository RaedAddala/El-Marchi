import { Logger } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export const KEY_PATH = join(__dirname, 'keys');
Logger.log(KEY_PATH);
/**
 * Generates an ECDSA key pair using the 'prime256v1' curve (suitable for ES256) and saves
 * them as PEM encoded files in the specified keys directory.
 *
 * This function uses Node.js's `generateKeyPairSync` method from the 'crypto' module.
 *
 * Key details:
 * - The first parameter 'ec' specifies that an Elliptic Curve (EC) key pair is generated.
 * - The `namedCurve` option 'prime256v1' is used, which is equivalent to secp256r1 and provides a 256-bit key,
 *   making it compliant with the ES256 algorithm.
 * - Public key encoding is set to 'spki' (Subject Public Key Info), which is a standard format for public keys,
 *   and 'pem' output format (Base64 with header/footer).
 * - Private key encoding is set to 'pkcs8', a standard format for storing private keys, and also uses the 'pem'
 *   format.
 *
 * @param {string} name - The base name for the key files. Two files will be generated:
 *                        '<name>_private.pem' for the private key and '<name>_public.pem'
 *                        for the public key.
 */
function generateECDSAKeys(name: string) {
  if (!existsSync(KEY_PATH)) mkdirSync(KEY_PATH);

  // For ES256, use the 'prime256v1' curve (alias for secp256r1)
  const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  writeFileSync(join(KEY_PATH, `${name}_private.pem`), privateKey);
  writeFileSync(join(KEY_PATH, `${name}_public.pem`), publicKey);
}

/**
 * Checks if the key files for access and refresh tokens exist in the keys directory.
 * If they do not, it generates new key pairs for both using the ES256 algorithm.
 */
export function generateKeys() {
  if (!existsSync(join(KEY_PATH, 'access_public.pem'))) {
    generateECDSAKeys('access');
  }
  if (!existsSync(join(KEY_PATH, 'refresh_public.pem'))) {
    generateECDSAKeys('refresh');
  }
}
