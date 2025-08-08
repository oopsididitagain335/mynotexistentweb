// lib/crypto.ts
import * as sodium from 'libsodium-wrappers';

await sodium.ready;
const {
  crypto_box_keypair,
  crypto_box_seed_keypair,
  crypto_secretbox_easy,
  crypto_secretbox_open_easy,
  from_base64,
  to_base64,
} = sodium;

// Generate X25519 key pair
export const generateKeyPair = () => {
  const keypair = crypto_box_keypair();
  return {
    publicKey: to_base64(keypair.publicKey),
    privateKey: to_base64(keypair.privateKey),
  };
};

// Derive key from password (PBKDF2)
export const deriveKeyFromPassword = (password: string, salt: Uint8Array): Uint8Array => {
  return sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
};

// Encrypt private key with password
export const encryptPrivateKey = (
  privateKey: string,
  password: string
): { encrypted: string; salt: string; nonce: string } => {
  const salt = sodium.randombytes_buf(16);
  const nonce = sodium.randombytes_buf(24);
  const key = deriveKeyFromPassword(password, salt);
  const plaintext = Uint8Array.from(Buffer.from(privateKey));
  const ciphertext = crypto_secretbox_easy(plaintext, nonce, key);
  return {
    encrypted: to_base64(ciphertext),
    salt: to_base64(salt),
    nonce: to_base64(nonce),
  };
};

// Decrypt private key
export const decryptPrivateKey = (
  encrypted: string,
  salt: string,
  nonce: string,
  password: string
): string | null => {
  try {
    const key = deriveKeyFromPassword(password, from_base64(salt));
    const ciphertext = from_base64(encrypted);
    const nonceBuf = from_base64(nonce);
    const decrypted = crypto_secretbox_open_easy(ciphertext, nonceBuf, key);
    if (!decrypted) return null;
    return Buffer.from(decrypted).toString('utf8');
  } catch {
    return null;
  }
};

// Encrypt message with recipient's public key
export const encryptMessage = (message: string, recipientPublicKey: string) => {
  const sender = crypto_box_keypair();
  const nonce = sodium.randombytes_buf(24);
  const publicKey = from_base64(recipientPublicKey);
  const privateKey = sender.privateKey;
  const plaintext = Uint8Array.from(Buffer.from(message));
  const ciphertext = sodium.crypto_box_easy(plaintext, nonce, publicKey, privateKey);
  return {
    ciphertext: to_base64(ciphertext),
    ephemeralPublicKey: to_base64(sender.publicKey),
    nonce: to_base64(nonce),
  };
};

// Decrypt message with your private key
export const decryptMessage = (
  ciphertext: string,
  ephemeralPublicKey: string,
  nonce: string,
  yourPrivateKey: string
): string | null => {
  try {
    const c = from_base64(ciphertext);
    const epk = from_base64(ephemeralPublicKey);
    const n = from_base64(nonce);
    const sk = from_base64(yourPrivateKey);
    const plaintext = sodium.crypto_box_open_easy(c, n, epk, sk);
    return Buffer.from(plaintext).toString('utf8');
  } catch {
    return null;
  }
};
