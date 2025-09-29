const base64UrlEncode = (input) => {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    const base64 = typeof btoa === 'function'
        ? btoa(binary)
        : typeof Buffer !== 'undefined'
            ? Buffer.from(binary, 'binary').toString('base64')
            : (() => {
                throw new Error('Base64 encoding is not supported in this environment.');
            })();
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const getCrypto = async () => {
    if (typeof globalThis.crypto !== 'undefined') {
        return globalThis.crypto;
    }
    if (typeof globalThis.process !== 'undefined' && globalThis.process.versions?.node) {
        const moduleId = 'node:crypto';
        const nodeCrypto = (await import(/* @vite-ignore */ moduleId));
        if (nodeCrypto.webcrypto) {
            return nodeCrypto.webcrypto;
        }
    }
    throw new Error('Web Crypto API is not available in the current environment.');
};
export const generateCodeVerifier = async (length = 64) => {
    const crypto = await getCrypto();
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return base64UrlEncode(bytes);
};
export const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const crypto = await getCrypto();
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(digest);
};
