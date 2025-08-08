// types/libsodium-wrappers.d.ts
declare module 'libsodium-wrappers' {
  const ready: Promise<void>;

  function crypto_pwhash(
    outlen: number,
    passwd: string | Uint8Array,
    salt: Uint8Array,
    opslimit: number,
    memlimit: number,
    alg: number
  ): Uint8Array;

  function crypto_secretbox_easy(
    message: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array;

  function crypto_secretbox_open_easy(
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ): Uint8Array;

  function crypto_box_keypair(): { publicKey: Uint8Array; privateKey: Uint8Array };

  function crypto_box_easy(
    message: Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array
  ): Uint8Array;

  function crypto_box_open_easy(
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array
  ): Uint8Array;

  function from_base64(s: string): Uint8Array;
  function to_base64(s: Uint8Array): string;
  function randombytes_buf(n: number): Uint8Array;

  export {
    ready,
    crypto_pwhash,
    crypto_secretbox_easy,
    crypto_secretbox_open_easy,
    crypto_box_keypair,
    crypto_box_easy,
    crypto_box_open_easy,
    from_base64,
    to_base64,
    randombytes_buf,
  };
}
