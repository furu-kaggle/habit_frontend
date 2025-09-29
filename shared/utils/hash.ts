export const createEventHash = async (
  sourceEventId: string,
  startIso: string,
  endIso: string,
  sourceCalendarId: string
): Promise<string> => {
  const text = `${sourceEventId}|${startIso}|${endIso}|${sourceCalendarId}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  const { createHash } = await import('crypto');
  return createHash('sha1').update(text).digest('hex');
};
