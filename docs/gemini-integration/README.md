# Gemini Live API Integration Guide

## Обзор

SpeakUp AI использует Google Gemini Live API для обеспечения естественного диалога, анализа речи и персонализированной обратной связи. Проект интегрирует три модели Gemini для различных сценариев использования.

## Модели Gemini

### 1. gemini-2.0-flash-live

**Назначение**: Быстрые диалоги в реальном времени

**Характеристики**:
- Минимальная задержка (< 500ms)
- Оптимизирован для текстовых диалогов
- Подходит для базовых уровней (Beginner/Intermediate)

**Сценарии использования**:
```typescript
// Быстрый разговорный диалог
const response = await geminiService.generateResponse(
  "How do I ask for directions?",
  GeminiModel.FAST,
  conversationHistory
);

// Простые ответы на вопросы
const quickAnswer = await geminiService.generateResponse(
  "What does 'awesome' mean?",
  GeminiModel.FAST
);
```

**Когда использовать**:
- Начальные и средние уровни обучения
- Текстовые чаты без аудио
- Быстрые ответы на простые вопросы
- Высокая частота запросов

### 2. gemini-2.5-flash-live

**Назначение**: Расширенный анализ и сложные диалоги

**Характеристики**:
- Улучшенное понимание контекста
- Детальный анализ грамматики
- Мультимодальная поддержка (текст + аудио)
- Более точные коррекции

**Сценарии использования**:
```typescript
// Анализ грамматических ошибок
const analysis = await geminiService.analyzeGrammar(
  "I goes to school yesterday",
  UserLevel.ADVANCED
);
// Результат:
// {
//   corrections: [
//     {
//       original: "I goes",
//       corrected: "I went",
//       explanation: "Use past tense 'went' with time indicator 'yesterday'",
//       type: "grammar"
//     }
//   ],
//   overallFeedback: "Good sentence structure, watch verb tenses with time indicators"
// }

// Генерация обратной связи по сессии
const feedback = await geminiService.generateSessionFeedback(
  conversationMessages,
  UserLevel.ADVANCED
);
```

**Когда использовать**:
- Продвинутый уровень обучения
- Детальный разбор ошибок
- Генерация персонализированных рекомендаций
- Анализ прогресса пользователя

### 3. gemini-2.5-flash-native-audio-dialog

**Назначение**: HD-качество голосового взаимодействия

**Характеристики**:
- Естественное распознавание речи
- Эмоциональная окраска голоса
- Поддержка прерываний и пауз
- 24 языка
- HD-качество аудио

**Сценарии использования**:
```typescript
// Обработка аудио входа
const result = await geminiService.processAudioInput(
  audioBuffer,
  "Analyze my pronunciation and provide feedback",
  UserLevel.INTERMEDIATE
);
// Результат:
// {
//   transcription: "I want to learn English",
//   response: "Great pronunciation! Your 'want' was clear...",
//   analysis: {
//     clarity: 0.92,
//     pronunciation_issues: ["'learn' - stress on first syllable"]
//   }
// }

// Практика презентации
const presentationFeedback = await geminiService.processAudioInput(
  presentationAudio,
  "Evaluate my presentation skills: pace, clarity, confidence",
  UserLevel.ADVANCED
);
```

**Когда использовать**:
- Практика произношения
- Подготовка к презентациям
- Имитация реальных разговоров
- Оценка интонации и эмоций

## Настройка и конфигурация

### Получение API ключа

1. Перейдите в [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Создайте новый API ключ
3. Скопируйте ключ в `.env` файл

### Конфигурация в .env

```bash
# Gemini API Configuration
GEMINI_API_KEY=AIzaSy...your_key_here
GEMINI_PROJECT_ID=your-project-id

# Model Selection
GEMINI_MODEL_FAST=gemini-2.0-flash-live
GEMINI_MODEL_ADVANCED=gemini-2.5-flash-live
GEMINI_MODEL_AUDIO=gemini-2.5-flash-native-audio-dialog

# Generation Parameters
GEMINI_TEMPERATURE=0.7          # Креативность (0.0-1.0)
GEMINI_MAX_TOKENS=2048          # Максимальная длина ответа
GEMINI_TOP_P=0.95               # Nucleus sampling
GEMINI_TOP_K=40                 # Top-K sampling

# Streaming
GEMINI_ENABLE_STREAMING=true    # Потоковая генерация
```

### Параметры генерации

**Temperature** (0.0 - 1.0):
- `0.0-0.3`: Предсказуемые, точные ответы (грамматический анализ)
- `0.4-0.7`: Сбалансированная креативность (обычные диалоги)
- `0.8-1.0`: Высокая креативность (открытые беседы)

**Max Tokens**:
- Короткие ответы: 256-512
- Обычные диалоги: 1024-2048
- Детальный анализ: 2048-4096

## Примеры интеграции

### Базовый диалог

```typescript
import { geminiService } from './services/gemini.service';
import { UserLevel, GeminiModel } from '@speakup-ai/types';

// Автоматический выбор модели по уровню
const level = UserLevel.INTERMEDIATE;
const model = geminiService.selectModel(level);

// Генерация ответа
const response = await geminiService.generateResponse(
  "Can you help me practice ordering food at a restaurant?",
  model
);

console.log(response);
// "Of course! Let's practice. I'll be the waiter.
//  You're at an Italian restaurant. What would you like to order?"
```

### Потоковая генерация

```typescript
// Для real-time UI обновлений
async function streamResponse(userMessage: string) {
  const generator = geminiService.generateStreamingResponse(
    userMessage,
    GeminiModel.FAST,
    previousMessages
  );

  let fullResponse = '';

  for await (const chunk of generator) {
    fullResponse += chunk;
    // Обновить UI с частичным ответом
    updateUI(fullResponse);
  }

  return fullResponse;
}
```

### Анализ с контекстом

```typescript
// Сохранение истории разговора
const conversationHistory = [
  "Hello! I want to practice English.",
  "Great! What would you like to talk about?",
  "I'm interested in discussing climate change.",
  "That's an important topic! What aspect interests you most?"
];

// Продолжение диалога с контекстом
const response = await geminiService.generateResponse(
  "I want to know about renewable energy solutions.",
  GeminiModel.ADVANCED,
  conversationHistory
);
```

### Обработка аудио

```typescript
import { AudioRecorder } from './audio-recorder';

// Запись аудио
const audioBuffer = await AudioRecorder.record();

// Отправка на анализ
const result = await geminiService.processAudioInput(
  audioBuffer,
  "Transcribe this and check my pronunciation",
  UserLevel.INTERMEDIATE
);

console.log('Transcription:', result.transcription);
console.log('Feedback:', result.response);
```

## Обработка ошибок

```typescript
try {
  const response = await geminiService.generateResponse(
    prompt,
    model,
    context
  );
} catch (error) {
  if (error.message.includes('API_KEY')) {
    // Неверный API ключ
    console.error('Invalid Gemini API key');
  } else if (error.message.includes('QUOTA_EXCEEDED')) {
    // Превышена квота
    console.error('API quota exceeded');
  } else if (error.message.includes('RATE_LIMIT')) {
    // Слишком много запросов
    console.error('Rate limit exceeded, retry after delay');
  } else {
    // Общая ошибка
    console.error('Gemini API error:', error.message);
  }
}
```

## Лимиты и квоты

### Бесплатный tier
- **Requests per minute (RPM)**: 15
- **Tokens per minute (TPM)**: 32,000
- **Requests per day**: 1,500

### Paid tier
- **RPM**: 300+
- **TPM**: 4,000,000+
- Контактируйте Google для enterprise квот

### Best Practices

1. **Кэширование**:
   ```typescript
   // Используйте Redis для кэширования частых запросов
   const cacheKey = `gemini:${hash(prompt)}`;
   const cached = await redis.get(cacheKey);
   if (cached) return cached;

   const response = await geminiService.generateResponse(...);
   await redis.setex(cacheKey, 3600, response); // 1 час
   ```

2. **Rate Limiting**:
   ```typescript
   import rateLimit from 'express-rate-limit';

   const geminiLimiter = rateLimit({
     windowMs: 60 * 1000, // 1 минута
     max: 10, // 10 запросов
   });

   app.use('/api/dialogue', geminiLimiter);
   ```

3. **Retry логика**:
   ```typescript
   async function retryableRequest(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await sleep(Math.pow(2, i) * 1000); // Exponential backoff
       }
     }
   }
   ```

## Мониторинг

```typescript
// Логирование использования API
logger.info({
  model: model,
  promptLength: prompt.length,
  responseLength: response.length,
  duration: Date.now() - startTime,
  userId: userId,
}, 'Gemini API call');
```

## Безопасность

### Защита API ключа

❌ **Неправильно**:
```typescript
// НЕ ДЕЛАЙТЕ ТАК - ключ в клиентском коде!
const client = new GoogleGenerativeAI('AIzaSy...');
```

✅ **Правильно**:
```typescript
// Только на сервере, из переменных окружения
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing API key');
```

### Фильтрация контента

```typescript
// Проверка небезопасного контента
if (response.safetyRatings?.some(r => r.probability === 'HIGH')) {
  // Не показывать ответ, вернуть safe alternative
  return "I'm sorry, I can't help with that topic.";
}
```

## Дополнительные ресурсы

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pricing Calculator](https://ai.google.dev/pricing)
- [Best Practices Guide](https://ai.google.dev/docs/best_practices)
- [Community Forum](https://discuss.ai.google.dev/)

## Поддержка

Вопросы по интеграции Gemini API:
- GitHub Issues: https://github.com/yourusername/speakup-ai/issues
- Email: support@speakup-ai.com
