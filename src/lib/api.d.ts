import type { ApiResponseBase, ClassifiedCalendarEvent, OverlayEventRequest } from '../../shared/types/calendar';
export declare const fetchClassifiedEvents: (range?: "today" | "7d") => Promise<ClassifiedCalendarEvent[]>;
export declare const putOverlayEvent: (payload: OverlayEventRequest) => Promise<ApiResponseBase>;
export declare const removeOverlayEvent: (payload: {
    sourceEventId: string;
    sourceCalendarId?: string;
    hashKey?: string;
}) => Promise<ApiResponseBase>;
export declare const triggerAutoPlan: () => Promise<ApiResponseBase>;
export declare const quickAddMeal: (input: string) => Promise<ApiResponseBase>;
