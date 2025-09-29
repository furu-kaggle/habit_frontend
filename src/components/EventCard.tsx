import type { ClassifiedCalendarEvent } from '../../shared/types/calendar';
import { formatEventDateLabel, formatEventTimeRange } from '../lib/time';

const CATEGORY_CLASS: Record<
  ClassifiedCalendarEvent['classification']['category'],
  string
> = {
  habit: 'badge badge--habit',
  meal: 'badge badge--meal',
  'ad-hoc': 'badge badge--ad-hoc'
};

interface EventCardProps {
  event: ClassifiedCalendarEvent;
  onToggleOverlay: (event: ClassifiedCalendarEvent) => void;
  isInOverlay: boolean;
}

export const EventCard = ({ event, onToggleOverlay, isInOverlay }: EventCardProps) => {
  const { classification } = event;
  const startIso = event.start.dateTime;
  const endIso = event.end.dateTime;
  const dateLabel = formatEventDateLabel(startIso);
  const timeLabel = formatEventTimeRange(startIso, endIso);

  const handleToggle = () => {
    onToggleOverlay(event);
  };

  return (
    <article className="event-card">
      <div className="event-card__info">
        <div className="event-card__title">{event.title}</div>
        <div className="event-card__meta">
          <span>{dateLabel}</span>
          <span>{timeLabel}</span>
        </div>
        <div className="event-card__meta">
          <span className={CATEGORY_CLASS[classification.category]}>
            {classification.category.toUpperCase()}
          </span>
          <span className="text-muted">信頼度 {(classification.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className="event-card__actions">
        <button type="button" className="secondary-button" onClick={handleToggle}>
          {isInOverlay ? 'My Plan から外す' : 'My Plan に入れる'}
        </button>
      </div>
    </article>
  );
};
