import type { CalendarEvent } from '../types/calendar';
export declare const MAX_DESCRIPTION_LENGTH = 512;
export declare const CLASSIFIER_SYSTEM_PROMPT = "\u3042\u306A\u305F\u306F\u30AB\u30EC\u30F3\u30C0\u30FC\u30A4\u30D9\u30F3\u30C8\u5206\u985E\u5668\u3067\u3059\u3002\u51FA\u529B\u306F\u5FC5\u305A\u6709\u52B9\u306AJSON\u4E00\u500B\u306E\u307F\u3002\u8003\u3048\u65B9\u306E\u8AAC\u660E\u306F\u4E0D\u8981\u3002\u672A\u77E5\u8A9E\u306F\u6587\u8108\u3067\u63A8\u5B9A\u3057\u3001\u30AB\u30C6\u30B4\u30EA\u306F {habit, meal, ad-hoc} \u304B\u3089\u53B3\u5BC6\u306B\u9078\u3076\u3053\u3068\u3002";
export interface ChatMessage {
    role: 'system' | 'user';
    content: string;
}
export declare const buildClassifierUserPrompt: (event: CalendarEvent) => string;
export declare const buildClassifierMessages: (event: CalendarEvent) => ChatMessage[];
