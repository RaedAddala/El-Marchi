import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { generateKeyPairSync } from 'crypto';

/**
 * generateKeys
 *
 * This function generates and saves two sets of Ed25519 key pairs for use in cryptographic operations,
 * such as signing and verifying tokens.
 *
 * Ed25519 is an Edward Curve Cryptographic Function. This is perfect in terms of security and performance.
 *
 * Key generation details:
 * - Uses Node.js's built-in crypto module with the 'ed25519' algorithm.
 * - Generates separate key pairs for Access Tokens and Refresh Tokens.
 *
 * Key export formats:
 * - Private keys are exported in 'pkcs8' format:
 *    - PKCS #8 is a standardized syntax for storing private key information. It includes details like
 *      the algorithm identifier and the private key data, ensuring compatibility across various systems.
 *
 * - Public keys are exported in 'spki' format:
 *    - SPKI (Subject Public Key Info) is defined by the X.509 standard for storing public keys.
 *      It encapsulates both the algorithm information and the public key itself, which facilitates
 *      secure sharing and distribution.
 *
 * - Both keys are encoded in 'pem' format:
 *    - PEM (Privacy-Enhanced Mail) encodes binary data into base64 text, wrapped in header and footer lines
 *      (e.g., "-----BEGIN PUBLIC KEY-----"). This format is both human-readable and widely used in cryptographic
 *      applications.
 *
 * File system operations:
 * - Checks for the existence of a './keys' directory and creates it if not present.
 * - Verifies whether key files exist before generating new keys to prevent overwriting existing keys.
 */
export function generateKeys() {
  const keyDir = './keys';
  if (!existsSync(keyDir)) mkdirSync(keyDir);

  // Access Token Keys
  if (!existsSync(`${keyDir}/access_private.pem`)) {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    writeFileSync(`${keyDir}/access_private.pem`, privateKey.export({ type: 'pkcs8', format: 'pem' }));
    writeFileSync(`${keyDir}/access_public.pem`, publicKey.export({ type: 'spki', format: 'pem' }));
  }

  // Refresh Token Keys
  if (!existsSync(`${keyDir}/refresh_private.pem`)) {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    writeFileSync(`${keyDir}/refresh_private.pem`, privateKey.export({ type: 'pkcs8', format: 'pem' }));
    writeFileSync(`${keyDir}/refresh_public.pem`, publicKey.export({ type: 'spki', format: 'pem' }));
  }
}
