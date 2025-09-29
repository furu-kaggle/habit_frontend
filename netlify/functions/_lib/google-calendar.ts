import type { CalendarEvent, ClassifiedCalendarEvent } from '../../shared/types/calendar';

export interface CalendarListOptions {
  startIso: string;
  endIso: string;
  syncToken?: string;
  calendarIds: string[];
}

export class GoogleCalendarService {
  constructor(private readonly accessToken: string) {}

  async ensureOverlayCalendar(): Promise<string> {
    // TODO: call Google Calendar API to find or create overlay calendar
    console.info('ensureOverlayCalendar called');
    return 'my-plan-calendar-id';
  }

  async listEvents(options: CalendarListOptions): Promise<CalendarEvent[]> {
    console.info('listEvents called with', options);
    return [];
  }

  async listClassifiedEvents(options: CalendarListOptions): Promise<ClassifiedCalendarEvent[]> {
    const events = await this.listEvents(options);
    return events.map((event) => ({
      ...event,
      classification: {
        category: 'ad-hoc',
        confidence: 0,
        meal: null,
        habit: null
      }
    }));
  }

  async insertOverlayEvent(calendarId: string, event: CalendarEvent): Promise<string> {
    console.info('insertOverlayEvent called for', calendarId, event);
    return 'my-plan-event-id';
  }

  async deleteOverlayEvent(calendarId: string, eventId: string): Promise<boolean> {
    console.info('deleteOverlayEvent called for', calendarId, eventId);
    return true;
  }
}
