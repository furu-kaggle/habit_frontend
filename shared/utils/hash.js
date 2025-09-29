const getSubtle = async () => {
    if (typeof globalThis.crypto?.subtle !== 'undefined') {
        return globalThis.crypto.subtle;
    }
    if (typeof globalThis.process !== 'undefined' && globalThis.process.versions?.node) {
        const moduleId = 'node:crypto';
        const nodeCrypto = (await import(/* @vite-ignore */ moduleId));
        if (nodeCrypto.webcrypto?.subtle) {
            return nodeCrypto.webcrypto.subtle;
        }
    }
    throw new Error('SubtleCrypto API is not available in the current environment.');
};
export const createEventHash = async (sourceEventId, startIso, endIso, sourceCalendarId) => {
    const text = `${sourceEventId}|${startIso}|${endIso}|${sourceCalendarId}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const subtle = await getSubtle();
    const digest = await subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
};
