import OpenAI from 'openai';

import type {
  CalendarEvent,
  ClassificationResult
} from '../../shared/types/calendar.ts';
import { classificationSchema } from '../../shared/schema/classification.ts';
import { buildClassifierMessages } from '../../shared/utils/prompt.ts';

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

const fallbackClassification: ClassificationResult = {
  category: 'ad-hoc',
  confidence: 0,
  meal: null,
  habit: null
};

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
};

type OpenAIResponse = Awaited<ReturnType<OpenAI['responses']['create']>>;

const extractTextOutput = (response: OpenAIResponse) => {
  if ('output_text' in response && response.output_text) {
    return response.output_text;
  }

  const firstItem = response.output?.[0];
  const firstContent = firstItem?.content?.[0];

  if (firstContent && firstContent.type === 'output_text') {
    return firstContent.text;
  }

  if (firstContent && firstContent.type === 'text') {
    return firstContent.text;
  }

  return null;
};

export const classifyEvent = async (event: CalendarEvent): Promise<ClassificationResult> => {
  try {
    const client = getClient();
    const input = buildClassifierMessages(event).map((message) => ({
      role: message.role,
      content: [{ type: 'text', text: message.content }]
    })) as unknown;

    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input
    });

    const output = extractTextOutput(response);
    if (!output) {
      throw new Error('Empty response from OpenAI');
    }

    return classificationSchema.parse(JSON.parse(output));
  } catch (error) {
    console.warn('LLM classification failed, falling back to ad-hoc.', error);
    return fallbackClassification;
  }
};

export const classifyEvents = async (
  events: CalendarEvent[]
): Promise<ClassificationResult[]> => {
  const results: ClassificationResult[] = [];

  for (const event of events) {
    const classification = await classifyEvent(event);
    results.push(classification);
  }

  return results;
};
