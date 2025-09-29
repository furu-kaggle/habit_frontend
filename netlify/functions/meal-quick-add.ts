import type { Handler } from '@netlify/functions';

import { createRequestContext, parseJsonBody } from './_lib/request';
import { badRequest, jsonResponse, methodNotAllowed, ok } from './_lib/response';

interface MealQuickAddRequest {
  input: string;
  date?: string;
}

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(requestId);
  }

  const payload = parseJsonBody<MealQuickAddRequest>(event);
  if (!payload?.input) {
    return badRequest('input is required', requestId);
  }

  // TODO: implement meal text parsing and create calendar event
  return ok({
    requestId,
    ok: true,
    parsed: {
      raw: payload.input
    }
  });
};
