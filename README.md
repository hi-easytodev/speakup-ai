# SpeakUp AI

Мультиплатформенное приложение-компаньон для практики разговорного английского языка с использованием Gemini Live API.

## 🎯 Описание проекта

SpeakUp AI — это интеллектуальное приложение для изучения английского языка, которое использует передовые AI-модели Google Gemini для создания естественных диалогов, коррекции ошибок и персонализированного обучения.

### Основные возможности

- 🗣️ **AI-собеседник** — практика разговорного английского с голосовым взаимодействием
- 📱 **Мультиплатформенность** — iOS, Android, Web
- 🎓 **Уровни сложности** — Beginner, Intermediate, Advanced
- ✅ **Коррекция ошибок** — автоматический анализ и обратная связь
- 📚 **Личный словарь** — сохранение новых слов и фраз
- 📊 **Аналитика прогресса** — отслеживание улучшений
- 🌍 **Мультиязычный интерфейс** — поддержка разных языков UI
- 🎭 **Сценарии обучения** — практика в различных ситуациях

## 🏗️ Архитектура

Проект построен на микросервисной архитектуре:

```
┌─────────────────────────────────────────────────────────┐
│                    Clients Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Mobile     │  │     Web      │  │   Desktop    │  │
│  │ React Native │  │    React     │  │   Electron   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│              (Express.js, WebSocket)                     │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│  Gemini Service  │              │  Core Services   │
│                  │              │                  │
│ • 2.0-flash-live │              │ • User Service   │
│ • 2.5-flash-live │              │ • History        │
│ • Native Audio   │              │ • Scenarios      │
│   Dialog         │              │ • Recommendations│
└──────────────────┘              │ • i18n Service   │
        │                          └──────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│         Speech Processing Layer               │
│  ┌──────────────┐       ┌──────────────┐    │
│  │ ASR Service  │       │ TTS Service  │    │
│  │ (Gemini API) │       │ (Gemini API) │    │
│  └──────────────┘       └──────────────┘    │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│              Data Layer                       │
│  ┌──────────────┐       ┌──────────────┐    │
│  │  PostgreSQL  │       │   MongoDB    │    │
│  │  (Users,     │       │  (History,   │    │
│  │   Progress)  │       │   Analytics) │    │
│  └──────────────┘       └──────────────┘    │
└──────────────────────────────────────────────┘
```

### Микросервисы

1. **API Gateway** — точка входа, маршрутизация, аутентификация
2. **ASR Service** — распознавание речи (Automatic Speech Recognition)
3. **TTS Service** — синтез речи (Text-to-Speech)
4. **Dialogue Service** — логика диалогов с использованием Gemini
5. **Scenarios Service** — управление обучающими сценариями
6. **History Service** — история диалогов и прогресс
7. **Recommendations Service** — персонализированные рекомендации
8. **i18n Service** — интернационализация и локализация
9. **User Service** — управление пользователями и профилями

## 🤖 Gemini Live API Integration

Проект использует три модели Gemini Live API для различных сценариев:

### 1. **gemini-2.0-flash-live**
- **Назначение**: Быстрые диалоги в реальном времени
- **Сценарии использования**:
  - Базовые разговорные практики (уровни Beginner/Intermediate)
  - Быстрые ответы на простые вопросы
  - Текстовые диалоги
- **Особенности**: Низкая задержка, высокая скорость ответа

### 2. **gemini-2.5-flash-live**
- **Назначение**: Расширенный анализ и сложные диалоги
- **Сценарии использования**:
  - Продвинутый уровень (Advanced)
  - Анализ грамматических ошибок
  - Детальная обратная связь
  - Мультимодальный ввод (текст + аудио)
- **Особенности**: Улучшенное понимание контекста, точность

### 3. **gemini-2.5-flash-native-audio-dialog**
- **Назначение**: Максимальное качество голосового взаимодействия
- **Сценарии использования**:
  - Практика произношения
  - Подготовка к презентациям
  - Эмоциональный диалог
  - Обработка прерываний и пауз
- **Особенности**:
  - Поддержка 24 языков
  - HD-качество голоса
  - Распознавание эмоций
  - Естественные интонации

### Требования к интеграции

```env
# Gemini API Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_PROJECT_ID=your_project_id

# Model Selection
GEMINI_MODEL_FAST=gemini-2.0-flash-live
GEMINI_MODEL_ADVANCED=gemini-2.5-flash-live
GEMINI_MODEL_AUDIO=gemini-2.5-flash-native-audio-dialog

# Streaming Configuration
GEMINI_ENABLE_STREAMING=true
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# Audio Configuration
AUDIO_SAMPLE_RATE=16000
AUDIO_ENCODING=LINEAR16
AUDIO_LANGUAGE_CODE=en-US
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ и npm/yarn
- Docker и Docker Compose
- Google Cloud Account с доступом к Gemini API
- React Native CLI (для мобильной разработки)

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/yourusername/speakup-ai.git
cd speakup-ai
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env
# Отредактируйте .env и добавьте ваш GEMINI_API_KEY
```

4. **Запустите сервисы через Docker Compose**
```bash
docker-compose up -d
```

5. **Запустите миграции базы данных**
```bash
npm run db:migrate
```

### Запуск для разработки

**Backend сервисы:**
```bash
npm run dev
```

**Мобильное приложение (iOS):**
```bash
cd clients/mobile
npm install
npx pod-install
npm run ios
```

**Мобильное приложение (Android):**
```bash
cd clients/mobile
npm install
npm run android
```

**Web клиент:**
```bash
cd clients/web
npm install
npm start
```

## 📱 Установка на устройства

### iOS

1. **TestFlight** (рекомендуется для распространения)
   - Соберите IPA файл
   - Загрузите в App Store Connect
   - Пригласите пользователей через TestFlight

2. **Direct Installation** (для разработки)
   ```bash
   cd clients/mobile
   npm run ios:device
   ```

### Android

1. **Google Play (Internal Testing)**
   - Соберите APK/AAB
   - Загрузите в Google Play Console
   - Создайте тестовую группу

2. **Direct APK Installation**
   ```bash
   cd clients/mobile
   npm run android:build
   # APK будет в android/app/build/outputs/apk/release/
   ```

   Передайте APK студентам через:
   - QR-код (используйте `qrencode`)
   - Прямую ссылку (разместите на веб-сервере)
   - Google Drive / Dropbox

### QR-код для установки

Создайте QR-код со ссылкой на APK:
```bash
npm run generate-qr
```

## 🧪 Тестирование

```bash
# Юнит-тесты для всех сервисов
npm run test

# Интеграционные тесты
npm run test:integration

# E2E тесты
npm run test:e2e

# Тесты с покрытием
npm run test:coverage
```

## 📦 Развертывание

### Docker

```bash
# Сборка всех образов
docker-compose build

# Запуск в production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Применить манифесты
kubectl apply -f infrastructure/kubernetes/

# Проверить статус
kubectl get pods -n speakup-ai
```

### Cloud Deployment

Подробные инструкции см. в [docs/deployment/](docs/deployment/)

- [AWS Deployment](docs/deployment/aws.md)
- [Google Cloud Platform](docs/deployment/gcp.md)
- [Azure Deployment](docs/deployment/azure.md)

## 📚 Документация

- [API Documentation](docs/api/) — описание всех API endpoints
- [Architecture](docs/architecture/) — детальная архитектура системы
- [Gemini Integration Guide](docs/gemini-integration/) — интеграция с Gemini API
- [Development Guide](docs/development.md) — руководство для разработчиков
- [Deployment Guide](docs/deployment/) — инструкции по развертыванию

## 🌍 Поддерживаемые языки

### UI Languages
- 🇺🇸 English
- 🇷🇺 Русский
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇨🇳 中文

### Practice Languages
- 🇬🇧 English (British)
- 🇺🇸 English (American)
- Другие доступны через Gemini API

## 🎯 Roadmap

- [x] Базовая архитектура микросервисов
- [x] Интеграция с Gemini Live API
- [x] Мобильный клиент (React Native)
- [ ] Offline режим
- [ ] Групповые занятия
- [ ] Геймификация
- [ ] Интеграция с календарем
- [ ] Smartwatch приложение
- [ ] AR режим для практики

## 🤝 Контрибьюция

Мы приветствуем вклад в проект! См. [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 👥 Команда

- Архитектура и Backend: [Your Name]
- Mobile Development: [Your Name]
- AI/ML Integration: [Your Name]

## 🙏 Благодарности

- Google Gemini Team за предоставление API
- React Native Community
- Все контрибьюторы проекта

## 📞 Поддержка

- 📧 Email: support@speakup-ai.com
- 💬 Discord: [Join our server](https://discord.gg/speakup-ai)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/speakup-ai/issues)

---

Made with ❤️ for language learners worldwide
