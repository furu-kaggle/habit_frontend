import type { Handler } from '@netlify/functions';

import { createRequestContext, parseJsonBody } from './_lib/request.ts';
import { badRequest, jsonResponse, methodNotAllowed, ok } from './_lib/response.ts';

interface OverlayRemovePayload {
  sourceEventId: string;
  sourceCalendarId?: string;
  hashKey?: string;
}

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(requestId);
  }

  const payload = parseJsonBody<OverlayRemovePayload>(event);
  if (!payload?.sourceEventId) {
    return badRequest('sourceEventId is required', requestId);
  }

  // TODO: implement Google Calendar delete logic
  return ok({
    requestId,
    ok: true,
    removed: true
  });
};
