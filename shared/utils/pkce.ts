const base64UrlEncode = (input: ArrayBuffer | Uint8Array): string => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : typeof Buffer !== 'undefined'
        ? Buffer.from(binary, 'binary').toString('base64')
        : (() => {
            throw new Error('Base64 encoding is not supported in this environment.');
          })();
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const getCrypto = async (): Promise<Crypto> => {
  if (typeof globalThis.crypto !== 'undefined') {
    return globalThis.crypto;
  }

  if (typeof globalThis.process !== 'undefined' && globalThis.process.versions?.node) {
    const moduleId = 'node:crypto';
    const nodeCrypto = (await import(/* @vite-ignore */ moduleId)) as typeof import('node:crypto');
    if (nodeCrypto.webcrypto) {
      return nodeCrypto.webcrypto as unknown as Crypto;
    }
  }

  throw new Error('Web Crypto API is not available in the current environment.');
};

export const generateCodeVerifier = async (length = 64): Promise<string> => {
  const crypto = await getCrypto();
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return base64UrlEncode(bytes);
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  const crypto = await getCrypto();
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
};
