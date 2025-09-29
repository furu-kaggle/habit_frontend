import { randomUUID } from 'node:crypto';
import type { HandlerEvent } from '@netlify/functions';

export interface RequestContext {
  requestId: string;
  event: HandlerEvent;
}

export const createRequestContext = (event: HandlerEvent): RequestContext => ({
  requestId: randomUUID(),
  event
});

export const parseJsonBody = <T>(event: HandlerEvent): T | null => {
  if (!event.body) {
    return null;
  }

  try {
    return JSON.parse(event.body) as T;
  } catch (error) {
    console.warn('Failed to parse JSON body', error);
    return null;
  }
};
