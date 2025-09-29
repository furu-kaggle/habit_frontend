import { truncate } from './text';
export const MAX_DESCRIPTION_LENGTH = 512;
export const CLASSIFIER_SYSTEM_PROMPT = `あなたはカレンダーイベント分類器です。出力は必ず有効なJSON一個のみ。考え方の説明は不要。未知語は文脈で推定し、カテゴリは {habit, meal, ad-hoc} から厳密に選ぶこと。`;
const schemaBlock = `{
  "category": "habit" | "meal" | "ad-hoc",
  "confidence": 0.0-1.0,
  "meal": {
    "kcal": number | null,
    "macros": { "protein_g": number | null, "fat_g": number | null, "carb_g": number | null } | null,
    "meal_label": "breakfast" | "lunch" | "dinner" | "snack" | null
  },
  "habit": {
    "is_recurring_like": boolean,
    "suggested_block_min": 10 | 20 | 30 | 45 | 60
  }
}`;
const buildEventInputBlock = (event) => {
    const description = event.description ? truncate(event.description, MAX_DESCRIPTION_LENGTH) : '';
    const recurrence = Boolean(event.recurrence && event.recurrence.length > 0);
    return [
        `- title: "${event.title}"`,
        `- description: "${description}"`,
        `- start: "${event.start.dateTime}" (tz=${event.start.timeZone})`,
        `- end: "${event.end.dateTime}"`,
        `- recurrence: ${recurrence}`,
        `- location: "${event.location ?? ''}"`
    ].join('\n');
};
export const buildClassifierUserPrompt = (event) => {
    return [
        '# 指示',
        '以下のイベントを {habit, meal, ad-hoc} に分類し、JSONのみ返すこと。',
        '出力はスキーマに厳密一致。数値は整数または小数。日本語/英語混在に対応。',
        '',
        '# スキーマ',
        schemaBlock,
        '',
        '# 入力',
        buildEventInputBlock(event),
        '',
        '# 例（望ましい出力）',
        '{"category":"habit","confidence":0.86,"meal":null,"habit":{"is_recurring_like":true,"suggested_block_min":30}}'
    ].join('\n');
};
export const buildClassifierMessages = (event) => [
    {
        role: 'system',
        content: CLASSIFIER_SYSTEM_PROMPT
    },
    {
        role: 'user',
        content: buildClassifierUserPrompt(event)
    }
];
