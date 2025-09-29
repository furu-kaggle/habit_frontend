const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const getRandomBytes = async (length: number) => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  const { randomBytes } = await import('node:crypto');
  return randomBytes(length);
};

export const generateCodeVerifier = async (length = 64): Promise<string> => {
  const randomBytes = await getRandomBytes(length);
  const bytes =
    randomBytes instanceof Uint8Array
      ? randomBytes
      : new Uint8Array(randomBytes.buffer, randomBytes.byteOffset, randomBytes.byteLength);
  return base64UrlEncode(bytes.buffer);
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(digest);
  }

  const { createHash } = await import('node:crypto');
  const hash = createHash('sha256').update(verifier).digest();
  return base64UrlEncode(hash.buffer);
};
