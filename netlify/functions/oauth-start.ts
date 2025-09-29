import type { Handler } from '@netlify/functions';

import { createRequestContext } from './_lib/request';
import { jsonResponse, methodNotAllowed, ok } from './_lib/response';

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);

  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { requestId, ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return methodNotAllowed(requestId);
  }

  // TODO: generate PKCE verifier and redirect URL
  return ok({
    requestId,
    ok: true,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?...'
  });
};
