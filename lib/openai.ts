import OpenAI from 'openai';
import { requireEnv } from '@/lib/env';
export const openai = new OpenAI({ apiKey: requireEnv.openAiApiKey() });
