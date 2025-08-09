// pages/api/utils/crypto-helpers.ts
import * as sodium from 'libsodium-wrappers';

// Initialize Sodium and store constants
let sodiumReady = false;
let OPSLIMIT: number;
let MEMLIMIT: number;
let ALG: number;

// Ensure Sodium is ready and capture constants
export const initSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready;
    OPSLIMIT = sodium.crypto_pwhash_opslimit_interactive;
    MEMLIMIT = sodium.crypto_pwhash_memlimit_interactive;
    ALG = sodium.crypto_pwhash_alg_default;
    sodiumReady = true;
  }
};

// Call init once at startup (do this in your API route or server init)
await initSodium();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = sodium.randombytes_buf(16);

  const key = sodium.crypto_pwhash(
    32,
    password,
    salt,
    OPSLIMIT,
    MEMLIMIT,
    ALG
  );

  return sodium.to_base64(key);
};

// Optional: verify password
export const verifyPassword = (
  storedKey: string,
  password: string,
  salt: Uint8Array
): boolean => {
  try {
    const key = sodium.crypto_pwhash(
      32,
      password,
      salt,
      OPSLIMIT,
      MEMLIMIT,
      ALG
    );
    const encoded = sodium.to_base64(key);
    return encoded === storedKey;
  } catch {
    return false;
  }
};
