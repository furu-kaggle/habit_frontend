import type { ClassifiedCalendarEvent } from '../../shared/types/calendar';
interface EventCardProps {
    event: ClassifiedCalendarEvent;
    onToggleOverlay: (event: ClassifiedCalendarEvent) => void;
    isInOverlay: boolean;
}
export declare const EventCard: ({ event, onToggleOverlay, isInOverlay }: EventCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
