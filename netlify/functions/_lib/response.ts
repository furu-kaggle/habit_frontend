import type { HandlerResponse } from '@netlify/functions';

export const jsonResponse = (statusCode: number, body: unknown): HandlerResponse => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  },
  body: JSON.stringify(body)
});

export const ok = (body: unknown): HandlerResponse => jsonResponse(200, body);

export const badRequest = (message: string, requestId: string): HandlerResponse =>
  jsonResponse(400, {
    requestId,
    ok: false,
    error: message
  });

export const internalError = (message: string, requestId: string): HandlerResponse =>
  jsonResponse(500, {
    requestId,
    ok: false,
    error: message
  });

export const methodNotAllowed = (requestId: string): HandlerResponse =>
  jsonResponse(405, {
    requestId,
    ok: false,
    error: 'Method not allowed'
  });
