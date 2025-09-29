const base64UrlEncode = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const getRandomBytes = async (length) => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return crypto.getRandomValues(new Uint8Array(length));
    }
    const { randomBytes } = await import('crypto');
    return randomBytes(length);
};
export const generateCodeVerifier = async (length = 64) => {
    const randomBytes = await getRandomBytes(length);
    const bytes = randomBytes instanceof Uint8Array
        ? randomBytes
        : new Uint8Array(randomBytes.buffer, randomBytes.byteOffset, randomBytes.byteLength);
    return base64UrlEncode(bytes.buffer);
};
export const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const digest = await crypto.subtle.digest('SHA-256', data);
        return base64UrlEncode(digest);
    }
    const { createHash } = await import('crypto');
    const hash = createHash('sha256').update(verifier).digest();
    return base64UrlEncode(hash.buffer);
};
