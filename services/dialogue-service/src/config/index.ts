import dotenv from 'dotenv';
import { GeminiModel } from '@speakup-ai/types';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3003', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    projectId: process.env.GEMINI_PROJECT_ID,
    models: {
      fast: (process.env.GEMINI_MODEL_FAST || GeminiModel.FAST) as GeminiModel,
      advanced: (process.env.GEMINI_MODEL_ADVANCED || GeminiModel.ADVANCED) as GeminiModel,
      audio: (process.env.GEMINI_MODEL_AUDIO || GeminiModel.AUDIO) as GeminiModel,
    },
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2048', 10),
    topP: parseFloat(process.env.GEMINI_TOP_P || '0.95'),
    topK: parseInt(process.env.GEMINI_TOP_K || '40', 10),
    enableStreaming: process.env.GEMINI_ENABLE_STREAMING === 'true',
  },

  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/speakup_ai',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.NODE_ENV === 'development',
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
};

// Validate required config
if (!config.gemini.apiKey) {
  throw new Error('GEMINI_API_KEY is required');
}
