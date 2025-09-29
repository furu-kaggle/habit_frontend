import type { ClassifiedCalendarEvent } from '../../shared/types/calendar.ts';

export const mockedEvents: ClassifiedCalendarEvent[] = [
  {
    id: 'evt-1',
    calendarId: 'primary',
    title: '朝ラン 6km',
    description: '皇居周回コース',
    start: { dateTime: '2025-09-29T06:00:00+09:00', timeZone: 'Asia/Tokyo' },
    end: { dateTime: '2025-09-29T06:45:00+09:00', timeZone: 'Asia/Tokyo' },
    classification: {
      category: 'habit',
      confidence: 0.92,
      habit: {
        is_recurring_like: true,
        suggested_block_min: 45
      },
      meal: null
    }
  },
  {
    id: 'evt-2',
    calendarId: 'primary',
    title: '🍱 ランチ 12:30 700kcal',
    description: 'P30 F20 C95',
    start: { dateTime: '2025-09-29T12:30:00+09:00', timeZone: 'Asia/Tokyo' },
    end: { dateTime: '2025-09-29T13:00:00+09:00', timeZone: 'Asia/Tokyo' },
    classification: {
      category: 'meal',
      confidence: 0.88,
      habit: null,
      meal: {
        kcal: 700,
        meal_label: 'lunch',
        macros: {
          protein_g: 30,
          fat_g: 20,
          carb_g: 95
        }
      }
    }
  },
  {
    id: 'evt-3',
    calendarId: 'primary',
    title: '臨時MTG(顧客A)',
    start: { dateTime: '2025-09-29T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
    end: { dateTime: '2025-09-29T15:45:00+09:00', timeZone: 'Asia/Tokyo' },
    description: 'Zoom: https://example.com/meet',
    classification: {
      category: 'ad-hoc',
      confidence: 0.64,
      habit: null,
      meal: null
    }
  }
];
