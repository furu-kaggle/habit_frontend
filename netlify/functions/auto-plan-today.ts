import type { Handler } from '@netlify/functions';

import { createRequestContext, parseJsonBody } from './_lib/request';
import { badRequest, jsonResponse, methodNotAllowed, ok } from './_lib/response';

interface AutoPlanRequest {
  date?: string;
  timezone?: string;
}

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed(requestId);
  }

  const payload = parseJsonBody<AutoPlanRequest>(event) ?? {};

  const targetDate = payload.date ?? new Date().toISOString().slice(0, 10);
  const timezone = payload.timezone ?? 'Asia/Tokyo';

  // TODO: implement auto-plan greedy algorithm here
  return ok({
    requestId,
    ok: true,
    date: targetDate,
    timezone,
    scheduledCount: 0
  });
};
