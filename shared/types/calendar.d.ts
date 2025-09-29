export type ClassificationCategory = 'habit' | 'meal' | 'ad-hoc';
export interface MealMacros {
    protein_g: number | null;
    fat_g: number | null;
    carb_g: number | null;
}
export interface MealClassification {
    kcal: number | null;
    macros: MealMacros | null;
    meal_label: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
}
export interface HabitClassification {
    is_recurring_like: boolean;
    suggested_block_min: 10 | 20 | 30 | 45 | 60;
}
export interface ClassificationResult {
    category: ClassificationCategory;
    confidence: number;
    meal: MealClassification | null;
    habit: HabitClassification | null;
}
export interface CalendarEventTime {
    dateTime: string;
    timeZone: string;
}
export interface CalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    description?: string | null;
    location?: string | null;
    start: CalendarEventTime;
    end: CalendarEventTime;
    recurrence?: string[];
    creator?: {
        email?: string;
        displayName?: string;
    };
    raw?: unknown;
}
export interface ClassifiedCalendarEvent extends CalendarEvent {
    classification: ClassificationResult;
    extendedProperties?: Record<string, string>;
}
export interface OverlayEventMetadata {
    sourceEventId: string;
    sourceCalendarId: string;
    hashKey: string;
    category: ClassificationCategory;
    classificationConfidence: number;
    meal?: MealClassification | null;
}
export interface OverlayEventRequest {
    sourceEventId: string;
    sourceCalendarId: string;
    start: string;
    end: string;
    hashKey: string;
    classification: ClassificationResult;
}
export interface FetchEventsResponse {
    requestId: string;
    ok: boolean;
    error?: string;
    events: ClassifiedCalendarEvent[];
    syncToken?: string;
    pollAfterMs?: number;
    timeZone?: string;
    range?: {
        start: string;
        end: string;
    };
}
export interface ApiResponseBase {
    requestId: string;
    ok: boolean;
    error?: string;
}
