// pages/api/utils/crypto-helpers.ts
import * as sodium from 'libsodium-wrappers';

// Ensure Sodium is initialized
await sodium.ready;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = sodium.randombytes_buf(16);

  const key = sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_opslimit_interactive,     // lowercase
    sodium.crypto_pwhash_memlimit_interactive,     // lowercase
    sodium.crypto_pwhash_alg_default               // lowercase
  );

  return sodium.to_base64(key);
};
