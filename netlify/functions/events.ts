import type { Handler } from '@netlify/functions';

import {
  AUTO_PLAN_POLL_INTERVAL_MS,
  CALENDAR_LOOKAHEAD_DAYS,
  CALENDAR_LOOKBACK_DAYS,
  DEFAULT_TIMEZONE
} from '../../shared/config/constants.ts';
import { mockedEvents } from '../../shared/mock/events.ts';
import type { FetchEventsResponse } from '../../shared/types/calendar.ts';
import { createRequestContext } from './_lib/request.ts';
import { jsonResponse, ok } from './_lib/response.ts';

export const handler: Handler = async (event) => {
  const { requestId } = createRequestContext(event);
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {
      requestId,
      ok: true
    });
  }
  const range = event.queryStringParameters?.range ?? 'today';
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (range === '7d') {
    start.setDate(start.getDate() - CALENDAR_LOOKBACK_DAYS);
    end.setDate(end.getDate() + CALENDAR_LOOKAHEAD_DAYS);
  }

  const response: FetchEventsResponse = {
    requestId,
    ok: true,
    events: mockedEvents,
    pollAfterMs: AUTO_PLAN_POLL_INTERVAL_MS,
    timeZone: DEFAULT_TIMEZONE,
    range: {
      start: start.toISOString(),
      end: end.toISOString()
    }
  };

  return ok(response);
};
