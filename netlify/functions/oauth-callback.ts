import type { Handler } from '@netlify/functions';

import { createRequestContext } from './_lib/request.ts';
import { badRequest, jsonResponse, methodNotAllowed, ok } from './_lib/response.ts';

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return methodNotAllowed(requestId);
  }

  const code = event.queryStringParameters?.code;
  if (!code) {
    return badRequest('Missing authorization code', requestId);
  }

  // TODO: exchange authorization code for tokens
  return ok({
    requestId,
    ok: true,
    tokens: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    }
  });
};
