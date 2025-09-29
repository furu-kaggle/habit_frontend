import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatEventDateLabel, formatEventTimeRange } from '../lib/time';
const CATEGORY_CLASS = {
    habit: 'badge badge--habit',
    meal: 'badge badge--meal',
    'ad-hoc': 'badge badge--ad-hoc'
};
export const EventCard = ({ event, onToggleOverlay, isInOverlay }) => {
    const { classification } = event;
    const startIso = event.start.dateTime;
    const endIso = event.end.dateTime;
    const dateLabel = formatEventDateLabel(startIso);
    const timeLabel = formatEventTimeRange(startIso, endIso);
    const handleToggle = () => {
        onToggleOverlay(event);
    };
    return (_jsxs("article", { className: "event-card", children: [_jsxs("div", { className: "event-card__info", children: [_jsx("div", { className: "event-card__title", children: event.title }), _jsxs("div", { className: "event-card__meta", children: [_jsx("span", { children: dateLabel }), _jsx("span", { children: timeLabel })] }), _jsxs("div", { className: "event-card__meta", children: [_jsx("span", { className: CATEGORY_CLASS[classification.category], children: classification.category.toUpperCase() }), _jsxs("span", { className: "text-muted", children: ["\u4FE1\u983C\u5EA6 ", (classification.confidence * 100).toFixed(0), "%"] })] })] }), _jsx("div", { className: "event-card__actions", children: _jsx("button", { type: "button", className: "secondary-button", onClick: handleToggle, children: isInOverlay ? 'My Plan から外す' : 'My Plan に入れる' }) })] }));
};
