import { useCallback, useEffect, useMemo, useState } from 'react';

import { CategoryFilter } from './components/CategoryFilter.tsx';
import { EventCard } from './components/EventCard.tsx';
import {
  fetchClassifiedEvents,
  putOverlayEvent,
  quickAddMeal,
  removeOverlayEvent,
  triggerAutoPlan
} from './lib/api.ts';
import { createEventHash } from '../shared/utils/hash.ts';
import { mockedEvents } from '../shared/mock/events.ts';
import type {
  ClassifiedCalendarEvent,
  ClassificationCategory
} from '../shared/types/calendar.ts';

import './styles/app.css';

type CategoryFilterValue = 'all' | ClassificationCategory;

interface OverlayState {
  [hash: string]: boolean;
}

type AutoPlanState = {
  isRunning: boolean;
  lastRunAt?: string;
};

const localKey = (event: ClassifiedCalendarEvent) =>
  `${event.id}|${event.start.dateTime}|${event.end.dateTime}|${event.calendarId}`;

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('all');
  const [overlayLookup, setOverlayLookup] = useState<OverlayState>({});
  const [autoPlanState, setAutoPlanState] = useState<AutoPlanState>({ isRunning: false });
  const [quickAddText, setQuickAddText] = useState('🍱 昼 12:30 700kcal P30 F20 C95');
  const [events, setEvents] = useState<ClassifiedCalendarEvent[]>(mockedEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchClassifiedEvents('7d');
      setEvents(data);
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage('イベントの取得に失敗しました');
    } finally {
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

  const overlayCount = useMemo(
    () => Object.values(overlayLookup).filter(Boolean).length,
    [overlayLookup]
  );

  const handleToggleOverlay = useCallback(
    async (event: ClassifiedCalendarEvent) => {
      const key = localKey(event);
      const isCurrentlyOverlayed = Boolean(overlayLookup[key]);
      const nextState = !isCurrentlyOverlayed;

      setOverlayLookup((prev) => ({
        ...prev,
        [key]: nextState
      }));

      try {
        const hashKey = await createEventHash(
          event.id,
          event.start.dateTime,
          event.end.dateTime,
          event.calendarId
        );

        if (nextState) {
          await putOverlayEvent({
            sourceEventId: event.id,
            sourceCalendarId: event.calendarId,
            start: event.start.dateTime,
            end: event.end.dateTime,
            hashKey,
            classification: event.classification
          });
        } else {
          await removeOverlayEvent({
            sourceEventId: event.id,
            sourceCalendarId: event.calendarId,
            hashKey
          });
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('My Plan との同期に失敗しました');
        setOverlayLookup((prev) => ({
          ...prev,
          [key]: isCurrentlyOverlayed
        }));
      }
    },
    [overlayLookup]
  );

  const handleAutoPlan = async () => {
    setAutoPlanState({ isRunning: true });
    try {
      await triggerAutoPlan();
      setAutoPlanState({ isRunning: false, lastRunAt: new Date().toISOString() });
      setErrorMessage(null);
    } catch (error) {
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
    } catch (error) {
      console.error(error);
      setErrorMessage('食事ブロックの追加に失敗しました');
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__top">
          <div>
            <h1 className="app-header__title">My Plan オーバーレイ</h1>
            <p className="text-muted">Googleカレンダーを壊さずに整える</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={handleAutoPlan}
            disabled={autoPlanState.isRunning}
          >
            {autoPlanState.isRunning ? '計画中…' : '今日を整える'}
          </button>
        </div>
        {errorMessage && <p className="text-muted">⚠️ {errorMessage}</p>}
        <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
      </header>

      <main className="app-body">
        <aside className="sidebar">
          <section className="sidebar__section">
            <h2 className="sidebar__title">My Plan 状態</h2>
            <div className="card">
              <div className="section-heading">オーバーレイ中</div>
              <div className="text-muted">{overlayCount} 件</div>
            </div>
            {autoPlanState.lastRunAt && (
              <p className="text-muted">
                最終オートプラン: {new Date(autoPlanState.lastRunAt).toLocaleString('ja-JP')}
              </p>
            )}
            {isLoading && <p className="text-muted">イベント取得中…</p>}
          </section>

          <section className="sidebar__section">
            <h2 className="sidebar__title">食事クイック追加</h2>
            <textarea
              className="quick-add-input"
              placeholder="🍜 夜 19:00 600kcal"
              value={quickAddText}
              onChange={(event) => setQuickAddText(event.target.value)}
            />
            <button type="button" className="primary-button" onClick={handleQuickAdd}>
              食事ブロックを追加
            </button>
          </section>

          <section className="sidebar__section">
            <h2 className="sidebar__title">対象カレンダー</h2>
            <div className="stacked-list">
              <div className="overlay-toggle">
                <span className="overlay-toggle__label">Primary カレンダー</span>
                <button type="button" className="overlay-toggle__button">
                  連携中
                </button>
              </div>
            </div>
          </section>
        </aside>

        <section className="event-board">
          <div className="section-heading">イベント一覧（分類済み）</div>
          <div className="event-list">
            {filteredEvents.map((event) => {
              const key = localKey(event);
              const isInOverlay = Boolean(overlayLookup[key]);
              return (
                <EventCard
                  key={key}
                  event={event}
                  onToggleOverlay={handleToggleOverlay}
                  isInOverlay={isInOverlay}
                />
              );
            })}
            {!isLoading && filteredEvents.length === 0 && (
              <p className="text-muted">このカテゴリのイベントはありません。</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
