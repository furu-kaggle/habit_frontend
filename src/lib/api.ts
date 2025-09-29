import type {
  ApiResponseBase,
  ClassifiedCalendarEvent,
  FetchEventsResponse,
  OverlayEventRequest
} from '../../shared/types/calendar';

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json'
};

const withRequestId = async <T extends ApiResponseBase>(response: Response) => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as T;
  if (!data.ok) {
    throw new Error(data.error ?? 'Unknown API error');
  }
  return data;
};

export const fetchClassifiedEvents = async (
  range: 'today' | '7d' = 'today'
): Promise<ClassifiedCalendarEvent[]> => {
  const response = await fetch(`/.netlify/functions/events?range=${range}`);
  const data = await withRequestId<FetchEventsResponse>(response);
  return data.events;
};

export const putOverlayEvent = async (payload: OverlayEventRequest) => {
  const response = await fetch('/.netlify/functions/overlay-put', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload)
  });
  return withRequestId<ApiResponseBase>(response);
};

export const removeOverlayEvent = async (payload: {
  sourceEventId: string;
  sourceCalendarId?: string;
  hashKey?: string;
}) => {
  const response = await fetch('/.netlify/functions/overlay-remove', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload)
  });
  return withRequestId<ApiResponseBase>(response);
};

export const triggerAutoPlan = async () => {
  const response = await fetch('/.netlify/functions/auto-plan-today', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({})
  });
  return withRequestId<ApiResponseBase>(response);
};

export const quickAddMeal = async (input: string) => {
  const response = await fetch('/.netlify/functions/meal-quick-add', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ input })
  });
  return withRequestId<ApiResponseBase>(response);
};
