// pages/api/utils/crypto-helpers.ts
import * as sodium from 'libsodium-wrappers';

await sodium.ready;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = sodium.randombytes_buf(16);
  const key = sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
  return sodium.to_base64(key);
};
