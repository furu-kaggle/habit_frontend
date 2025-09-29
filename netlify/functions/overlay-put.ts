import type { Handler } from '@netlify/functions';

import type { OverlayEventRequest } from '../../shared/types/calendar';
import { createRequestContext, parseJsonBody } from './_lib/request';
import { badRequest, jsonResponse, methodNotAllowed, ok } from './_lib/response';

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(requestId);
  }

  const payload = parseJsonBody<OverlayEventRequest>(event);
  if (!payload) {
    return badRequest('Invalid JSON payload', requestId);
  }

  // TODO: implement Google Calendar insert logic
  return ok({
    requestId,
    ok: true,
    overlayEventId: `my-plan-${payload.hashKey}`
  });
};
