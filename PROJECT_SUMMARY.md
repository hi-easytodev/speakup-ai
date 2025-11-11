# SpeakUp AI - Project Summary

## Что было создано

Полноценное мультиплатформенное приложение для изучения английского языка с микросервисной архитектурой и интеграцией Gemini Live API.

## Архитектура проекта

### Backend (Микросервисы)

1. **API Gateway** (порт 3000)
   - Центральная точка входа для всех запросов
   - Маршрутизация к микросервисам
   - Rate limiting
   - CORS и безопасность
   - WebSocket поддержка

2. **Dialogue Service** (порт 3003) ⭐ **КЛЮЧЕВОЙ СЕРВИС**
   - Интеграция с 3 моделями Gemini Live API
   - Генерация AI-ответов (обычные и потоковые)
   - Анализ грамматики
   - Генерация сценариев обучения
   - Обратная связь по сессиям
   - Обработка аудио входа

3. **ASR Service** (порт 3001)
   - Распознавание речи (Automatic Speech Recognition)

4. **TTS Service** (порт 3002)
   - Синтез речи (Text-to-Speech)

5. **Scenarios Service** (порт 3004)
   - Управление обучающими сценариями
   - Категории: Interview, Travel, Business, Casual

6. **History Service** (порт 3005)
   - История диалогов
   - Аналитика прогресса

7. **Recommendations Service** (порт 3006)
   - AI-рекомендации на основе прогресса

8. **i18n Service** (порт 3007)
   - Интернационализация интерфейса

9. **User Service** (порт 3008)
   - Управление пользователями
   - Аутентификация JWT

### Базы данных

- **PostgreSQL** - пользователи, прогресс, метаданные
- **MongoDB** - история диалогов, аналитика
- **Redis** - кэширование, сессии

### Мобильный клиент (React Native)

**Экраны:**
- Onboarding - приветствие
- Home - главная с быстрыми действиями
- Chat - диалог с AI
- Scenarios - список сценариев
- Progress - статистика прогресса
- Profile - профиль пользователя

**Функции:**
- Голосовой и текстовый ввод
- Разные режимы: Quick Chat, Presentation, Pronunciation, Grammar
- Адаптивный дизайн
- Статистика обучения

## Интеграция с Gemini Live API

### Модель 1: gemini-2.0-flash-live
**Использование:** Быстрые диалоги для Beginner/Intermediate
- Минимальная задержка
- Текстовые чаты
- Простые вопросы

### Модель 2: gemini-2.5-flash-live
**Использование:** Продвинутый анализ для Advanced
- Детальный разбор грамматики
- Персонализированная обратная связь
- Мультимодальность

### Модель 3: gemini-2.5-flash-native-audio-dialog
**Использование:** HD-качество голосовых диалогов
- Распознавание эмоций
- 24 языка
- Практика произношения
- Подготовка к презентациям

## Docker & Kubernetes

### Docker Compose
- Все сервисы в контейнерах
- Автоматическая настройка сети
- Persistent volumes для БД
- Health checks

### Kubernetes
- Production deployment манифесты
- Namespace: speakup-ai
- Secrets management
- LoadBalancer для API Gateway
- Автомасштабирование
- Rolling updates

## Документация

### 1. README.md
- Обзор проекта
- Архитектура
- Quick start
- Установка на iOS/Android/ПК
- QR-код для распространения

### 2. docs/gemini-integration/
- Детальное описание всех 3 моделей
- Примеры использования
- Параметры конфигурации
- Best practices
- Обработка ошибок
- Лимиты и квоты

### 3. docs/api/
- Полная спецификация API
- Все endpoints
- Примеры запросов/ответов
- WebSocket API
- SDK примеры

### 4. docs/deployment/
- Локальная разработка
- Production deployment
- Kubernetes setup
- Мобильное приложение (Android/iOS)
- Мониторинг
- Troubleshooting

## Тесты

- Unit тесты для Gemini Service
- Тесты выбора моделей
- Тесты генерации ответов
- Тесты анализа грамматики
- Тесты обратной связи

## Основные файлы

```
speakup-ai/
├── services/
│   ├── api-gateway/          ✅ API Gateway с proxy
│   ├── dialogue-service/     ✅ Gemini интеграция
│   ├── asr-service/          ✅ Распознавание речи
│   ├── tts-service/          ✅ Синтез речи
│   ├── scenarios-service/    ✅ Сценарии
│   ├── history-service/      ✅ История
│   ├── recommendations-service/ ✅ Рекомендации
│   ├── i18n-service/         ✅ i18n
│   └── user-service/         ✅ Пользователи
├── clients/
│   └── mobile/               ✅ React Native app
├── infrastructure/
│   ├── docker/               ✅ Dockerfiles
│   └── kubernetes/           ✅ K8s манифесты
├── docs/
│   ├── api/                  ✅ API docs
│   ├── gemini-integration/   ✅ Gemini guide
│   └── deployment/           ✅ Deployment guide
├── shared/
│   └── types/                ✅ TypeScript types
├── docker-compose.yml        ✅ Локальная разработка
├── .env.example              ✅ Переменные окружения
├── README.md                 ✅ Главная документация
├── CONTRIBUTING.md           ✅ Гайд для контрибьюторов
└── LICENSE                   ✅ MIT License
```

## Уровни сложности

- **Beginner** → gemini-2.0-flash-live
- **Intermediate** → gemini-2.0-flash-live или 2.5 (по контексту)
- **Advanced** → gemini-2.5-flash-live
- **Voice Mode** → gemini-2.5-flash-native-audio-dialog

## Функциональность

✅ AI-собеседник (голос + текст)
✅ Коррекция ошибок в реальном времени
✅ Личный словарь
✅ Аналитика прогресса
✅ Разные сценарии обучения
✅ Практика презентаций
✅ Мультиязычный интерфейс
✅ Разделение по уровням
✅ Распространение между студентами (QR, APK)
✅ Кросс-платформенность (iOS/Android/Web)

## Технологический стек

**Backend:**
- Node.js + TypeScript
- Express.js
- Google Gemini API
- PostgreSQL + MongoDB + Redis
- Docker + Kubernetes
- WebSocket (Socket.io)

**Frontend:**
- React Native
- React Navigation
- Redux Toolkit
- React Native Paper
- i18next

**DevOps:**
- Docker Compose
- Kubernetes
- Prometheus/Grafana (ready)
- ESLint + Prettier
- Jest для тестирования

## Следующие шаги для запуска

1. **Получить Gemini API key**
   - https://makersuite.google.com/app/apikey

2. **Настроить .env**
   ```bash
   cp .env.example .env
   # Добавить GEMINI_API_KEY
   ```

3. **Запустить локально**
   ```bash
   docker-compose up -d
   ```

4. **Тестировать API**
   ```bash
   curl http://localhost:3000/health
   ```

5. **Собрать мобильное приложение**
   ```bash
   cd clients/mobile
   npm install
   npm run android  # или npm run ios
   ```

## Лицензия

MIT License - свободное использование и модификация

## Поддержка

- GitHub: https://github.com/yourusername/speakup-ai
- Issues: https://github.com/yourusername/speakup-ai/issues
- Email: support@speakup-ai.com

---

**Проект полностью готов к использованию и дальнейшей разработке!** 🚀
