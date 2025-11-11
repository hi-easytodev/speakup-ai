# Quick Start Deployment Guide

## Локальная разработка

### Предварительные требования

- Node.js 18+
- Docker & Docker Compose
- Git
- Gemini API Key

### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/yourusername/speakup-ai.git
cd speakup-ai
```

### Шаг 2: Настройка переменных окружения

```bash
cp .env.example .env
```

Отредактируйте `.env` и добавьте ваш **GEMINI_API_KEY**:

```bash
GEMINI_API_KEY=AIzaSy...your_actual_api_key_here
```

### Шаг 3: Запуск через Docker Compose

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Проверить статус
docker-compose ps
```

### Шаг 4: Проверка работоспособности

Откройте браузер и перейдите:

- **API Gateway**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api

Вы должны увидеть:

```json
{
  "success": true,
  "data": {
    "service": "api-gateway",
    "status": "healthy",
    "services": ["asr", "tts", "dialogue", ...]
  }
}
```

### Шаг 5: Тестирование Gemini интеграции

```bash
curl -X POST http://localhost:3000/api/dialogue/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello! Can you help me practice English?",
    "level": "beginner"
  }'
```

---

## Production Deployment (Kubernetes)

### Шаг 1: Подготовка секретов

```bash
# Создать namespace
kubectl create namespace speakup-ai

# Создать секреты
kubectl create secret generic speakup-secrets \
  --from-literal=gemini-api-key=YOUR_GEMINI_KEY \
  --from-literal=jwt-secret=YOUR_JWT_SECRET \
  --from-literal=postgres-password=YOUR_DB_PASSWORD \
  -n speakup-ai
```

### Шаг 2: Сборка Docker образов

```bash
# Сборка всех образов
docker-compose build

# Тегирование для registry
docker tag speakup-ai/api-gateway:latest your-registry/api-gateway:v1.0.0
docker tag speakup-ai/dialogue-service:latest your-registry/dialogue-service:v1.0.0
# ... для всех сервисов

# Push в registry
docker push your-registry/api-gateway:v1.0.0
docker push your-registry/dialogue-service:v1.0.0
```

### Шаг 3: Deployment в Kubernetes

```bash
# Применить все манифесты
kubectl apply -f infrastructure/kubernetes/

# Проверить статус
kubectl get pods -n speakup-ai
kubectl get services -n speakup-ai

# Проверить логи
kubectl logs -f deployment/api-gateway -n speakup-ai
```

### Шаг 4: Настройка Ingress (опционально)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: speakup-ingress
  namespace: speakup-ai
spec:
  rules:
  - host: api.speakup-ai.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 80
```

---

## Мобильное приложение

### Android

```bash
cd clients/mobile

# Установить зависимости
npm install

# Настроить .env
echo "API_URL=https://api.speakup-ai.com" > .env

# Запустить на эмуляторе
npm run android

# Собрать APK для production
cd android
./gradlew assembleRelease

# APK будет в: android/app/build/outputs/apk/release/
```

**Распространение APK:**

1. **Через QR-код**:
```bash
# Установить qrencode
sudo apt-get install qrencode

# Разместить APK на веб-сервере
cp app-release.apk /var/www/html/speakup-ai.apk

# Генерировать QR-код
qrencode -o qr-code.png "https://your-domain.com/speakup-ai.apk"
```

2. **Через Google Play (Internal Testing)**:
   - Создайте аккаунт в Google Play Console
   - Создайте приложение
   - Загрузите APK/AAB
   - Создайте internal testing track
   - Добавьте тестеров по email

### iOS

```bash
cd clients/mobile

# Установить CocoaPods dependencies
cd ios
pod install
cd ..

# Запустить на симуляторе
npm run ios

# Для production build через Xcode:
# 1. Открыть ios/SpeakUpAI.xcworkspace
# 2. Product -> Archive
# 3. Distribute App -> TestFlight или App Store
```

**TestFlight распространение**:
1. Загрузите build через Xcode
2. Перейдите в App Store Connect
3. Добавьте тестеров
4. Они получат приглашение по email

---

## Мониторинг и логи

### Проверка здоровья сервисов

```bash
# Все сервисы
kubectl get pods -n speakup-ai

# Конкретный сервис
kubectl describe pod <pod-name> -n speakup-ai

# Логи
kubectl logs -f deployment/dialogue-service -n speakup-ai --tail=100
```

### Метрики (Prometheus)

```yaml
# prometheus-config.yaml
scrape_configs:
  - job_name: 'speakup-services'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - speakup-ai
```

### Алерты

Настройте алерты для:
- CPU/Memory usage > 80%
- Pod restarts > 3
- API latency > 2s
- Gemini API errors rate > 5%

---

## Обновление

### Rolling Update (Kubernetes)

```bash
# Обновить образ
kubectl set image deployment/dialogue-service \
  dialogue-service=your-registry/dialogue-service:v1.1.0 \
  -n speakup-ai

# Проверить статус rollout
kubectl rollout status deployment/dialogue-service -n speakup-ai

# Откатить при необходимости
kubectl rollout undo deployment/dialogue-service -n speakup-ai
```

### Zero-downtime deployment

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
```

---

## Troubleshooting

### Проблема: Сервис не запускается

```bash
# Проверить логи
kubectl logs <pod-name> -n speakup-ai

# Проверить события
kubectl get events -n speakup-ai --sort-by='.lastTimestamp'

# Проверить конфигурацию
kubectl describe pod <pod-name> -n speakup-ai
```

### Проблема: Gemini API ошибки

1. Проверьте API key в секретах
2. Проверьте квоты на https://console.cloud.google.com
3. Проверьте логи dialogue-service

### Проблема: База данных недоступна

```bash
# Проверить статус PostgreSQL
kubectl exec -it <postgres-pod> -n speakup-ai -- psql -U speakup_admin

# Проверить persistence volume
kubectl get pvc -n speakup-ai
```

---

## Масштабирование

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: dialogue-service-hpa
  namespace: speakup-ai
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dialogue-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Manual scaling

```bash
kubectl scale deployment dialogue-service --replicas=5 -n speakup-ai
```

---

## Безопасность

### SSL/TLS

```bash
# Установить cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Создать ClusterIssuer
kubectl apply -f infrastructure/kubernetes/cert-issuer.yaml
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: dialogue-service-policy
  namespace: speakup-ai
spec:
  podSelector:
    matchLabels:
      app: dialogue-service
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
```

---

## Поддержка

Документация:
- Architecture: [docs/architecture/](../architecture/)
- API Reference: [docs/api/](../api/)
- Gemini Integration: [docs/gemini-integration/](../gemini-integration/)

Помощь:
- GitHub Issues: https://github.com/yourusername/speakup-ai/issues
- Discord: https://discord.gg/speakup-ai
- Email: support@speakup-ai.com
