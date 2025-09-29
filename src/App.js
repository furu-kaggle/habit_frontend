import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { EventCard } from './components/EventCard';
import { fetchClassifiedEvents, putOverlayEvent, quickAddMeal, removeOverlayEvent, triggerAutoPlan } from './lib/api';
import { createEventHash } from '../shared/utils/hash';
import { mockedEvents } from '../shared/mock/events';
import './styles/app.css';
const localKey = (event) => `${event.id}|${event.start.dateTime}|${event.end.dateTime}|${event.calendarId}`;
function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [overlayLookup, setOverlayLookup] = useState({});
    const [autoPlanState, setAutoPlanState] = useState({ isRunning: false });
    const [quickAddText, setQuickAddText] = useState('🍱 昼 12:30 700kcal P30 F20 C95');
    const [events, setEvents] = useState(mockedEvents);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const loadEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchClassifiedEvents('7d');
            setEvents(data);
            setErrorMessage(null);
        }
        catch (error) {
            console.error(error);
            setErrorMessage('イベントの取得に失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void loadEvents();
    }, [loadEvents]);
    const filteredEvents = useMemo(() => {
        if (selectedCategory === 'all') {
            return events;
        }
        return events.filter((event) => event.classification.category === selectedCategory);
    }, [events, selectedCategory]);
    const overlayCount = useMemo(() => Object.values(overlayLookup).filter(Boolean).length, [overlayLookup]);
    const handleToggleOverlay = useCallback(async (event) => {
        const key = localKey(event);
        const isCurrentlyOverlayed = Boolean(overlayLookup[key]);
        const nextState = !isCurrentlyOverlayed;
        setOverlayLookup((prev) => ({
            ...prev,
            [key]: nextState
        }));
        try {
            const hashKey = await createEventHash(event.id, event.start.dateTime, event.end.dateTime, event.calendarId);
            if (nextState) {
                await putOverlayEvent({
                    sourceEventId: event.id,
                    sourceCalendarId: event.calendarId,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                    hashKey,
                    classification: event.classification
                });
            }
            else {
                await removeOverlayEvent({
                    sourceEventId: event.id,
                    sourceCalendarId: event.calendarId,
                    hashKey
                });
            }
        }
        catch (error) {
            console.error(error);
            setErrorMessage('My Plan との同期に失敗しました');
            setOverlayLookup((prev) => ({
                ...prev,
                [key]: isCurrentlyOverlayed
            }));
        }
    }, [overlayLookup]);
    const handleAutoPlan = async () => {
        setAutoPlanState({ isRunning: true });
        try {
            await triggerAutoPlan();
            setAutoPlanState({ isRunning: false, lastRunAt: new Date().toISOString() });
            setErrorMessage(null);
        }
        catch (error) {
            console.error(error);
            setAutoPlanState({ isRunning: false });
            setErrorMessage('オートプランの実行に失敗しました');
        }
    };
    const handleQuickAdd = async () => {
        if (!quickAddText.trim()) {
            return;
        }
        try {
            await quickAddMeal(quickAddText.trim());
            setQuickAddText('');
            setErrorMessage(null);
            await loadEvents();
        }
        catch (error) {
            console.error(error);
            setErrorMessage('食事ブロックの追加に失敗しました');
        }
    };
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsxs("div", { className: "app-header__top", children: [_jsxs("div", { children: [_jsx("h1", { className: "app-header__title", children: "My Plan \u30AA\u30FC\u30D0\u30FC\u30EC\u30A4" }), _jsx("p", { className: "text-muted", children: "Google\u30AB\u30EC\u30F3\u30C0\u30FC\u3092\u58CA\u3055\u305A\u306B\u6574\u3048\u308B" })] }), _jsx("button", { type: "button", className: "primary-button", onClick: handleAutoPlan, disabled: autoPlanState.isRunning, children: autoPlanState.isRunning ? '計画中…' : '今日を整える' })] }), errorMessage && _jsxs("p", { className: "text-muted", children: ["\u26A0\uFE0F ", errorMessage] }), _jsx(CategoryFilter, { value: selectedCategory, onChange: setSelectedCategory })] }), _jsxs("main", { className: "app-body", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("section", { className: "sidebar__section", children: [_jsx("h2", { className: "sidebar__title", children: "My Plan \u72B6\u614B" }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "section-heading", children: "\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u4E2D" }), _jsxs("div", { className: "text-muted", children: [overlayCount, " \u4EF6"] })] }), autoPlanState.lastRunAt && (_jsxs("p", { className: "text-muted", children: ["\u6700\u7D42\u30AA\u30FC\u30C8\u30D7\u30E9\u30F3: ", new Date(autoPlanState.lastRunAt).toLocaleString('ja-JP')] })), isLoading && _jsx("p", { className: "text-muted", children: "\u30A4\u30D9\u30F3\u30C8\u53D6\u5F97\u4E2D\u2026" })] }), _jsxs("section", { className: "sidebar__section", children: [_jsx("h2", { className: "sidebar__title", children: "\u98DF\u4E8B\u30AF\u30A4\u30C3\u30AF\u8FFD\u52A0" }), _jsx("textarea", { className: "quick-add-input", placeholder: "\uD83C\uDF5C \u591C 19:00 600kcal", value: quickAddText, onChange: (event) => setQuickAddText(event.target.value) }), _jsx("button", { type: "button", className: "primary-button", onClick: handleQuickAdd, children: "\u98DF\u4E8B\u30D6\u30ED\u30C3\u30AF\u3092\u8FFD\u52A0" })] }), _jsxs("section", { className: "sidebar__section", children: [_jsx("h2", { className: "sidebar__title", children: "\u5BFE\u8C61\u30AB\u30EC\u30F3\u30C0\u30FC" }), _jsx("div", { className: "stacked-list", children: _jsxs("div", { className: "overlay-toggle", children: [_jsx("span", { className: "overlay-toggle__label", children: "Primary \u30AB\u30EC\u30F3\u30C0\u30FC" }), _jsx("button", { type: "button", className: "overlay-toggle__button", children: "\u9023\u643A\u4E2D" })] }) })] })] }), _jsxs("section", { className: "event-board", children: [_jsx("div", { className: "section-heading", children: "\u30A4\u30D9\u30F3\u30C8\u4E00\u89A7\uFF08\u5206\u985E\u6E08\u307F\uFF09" }), _jsxs("div", { className: "event-list", children: [filteredEvents.map((event) => {
                                        const key = localKey(event);
                                        const isInOverlay = Boolean(overlayLookup[key]);
                                        return (_jsx(EventCard, { event: event, onToggleOverlay: handleToggleOverlay, isInOverlay: isInOverlay }, key));
                                    }), !isLoading && filteredEvents.length === 0 && (_jsx("p", { className: "text-muted", children: "\u3053\u306E\u30AB\u30C6\u30B4\u30EA\u306E\u30A4\u30D9\u30F3\u30C8\u306F\u3042\u308A\u307E\u305B\u3093\u3002" }))] })] })] })] }));
}
export default App;
