# SpeakUp AI API Documentation

## Base URL

```
Development: http://localhost:3000
Production: https://api.speakup-ai.com
```

## Authentication

All API requests (except public endpoints) require authentication via JWT token.

```http
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "service": "api-gateway",
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "services": ["asr", "tts", "dialogue", "scenarios", "history", "recommendations", "i18n", "users"]
  }
}
```

---

## Dialogue Service

### Generate Response

Generate AI response for user input.

```http
POST /api/dialogue/generate
```

**Request Body:**
```json
{
  "prompt": "Can you help me practice ordering food?",
  "level": "intermediate",
  "context": ["Previous message 1", "Previous response 1"],
  "requiresAudio": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Of course! Let's practice. What kind of restaurant would you like to role-play?",
    "model": "gemini-2.0-flash-live",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Streaming Response

Get streaming AI response (Server-Sent Events).

```http
POST /api/dialogue/stream
```

**Request Body:**
```json
{
  "prompt": "Tell me about climate change",
  "level": "advanced"
}
```

**Response (SSE):**
```
data: {"type":"start","model":"gemini-2.5-flash-live","timestamp":"..."}

data: {"type":"chunk","content":"Climate change refers to"}

data: {"type":"chunk","content":" long-term shifts in temperatures"}

data: {"type":"end"}
```

### Analyze Grammar

Analyze text for grammar, spelling, and usage errors.

```http
POST /api/dialogue/analyze
```

**Request Body:**
```json
{
  "text": "I goes to school yesterday",
  "level": "beginner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "corrections": [
      {
        "original": "I goes",
        "corrected": "I went",
        "explanation": "Use past tense 'went' with time indicator 'yesterday'",
        "type": "grammar"
      }
    ],
    "overallFeedback": "Good sentence structure! Watch your verb tenses."
  }
}
```

### Generate Scenario Prompt

Generate opening prompt for a learning scenario.

```http
POST /api/dialogue/scenario
```

**Request Body:**
```json
{
  "scenario": "Job Interview",
  "level": "intermediate",
  "objectives": ["Practice professional language", "Learn common interview questions"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompt": "Hello! I'm conducting interviews today. Thank you for coming. Tell me about yourself and why you're interested in this position?"
  }
}
```

### Generate Session Feedback

Get detailed feedback for a completed session.

```http
POST /api/dialogue/feedback
```

**Request Body:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello, I want to order food"},
    {"role": "assistant", "content": "Great! What would you like?"},
    {"role": "user", "content": "I want pizza please"}
  ],
  "level": "beginner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Good basic conversation with clear requests",
    "strengths": ["Clear pronunciation", "Polite language"],
    "improvements": ["Add more details", "Use varied vocabulary"],
    "recommendations": ["Practice describing food preferences", "Learn restaurant-specific vocabulary"],
    "scores": {
      "grammar": 85,
      "vocabulary": 75,
      "fluency": 80
    }
  }
}
```

### Process Audio

Process audio input and get transcription + response.

```http
POST /api/dialogue/audio
Content-Type: application/json
```

**Request Body:**
```json
{
  "audioData": "base64_encoded_audio_data",
  "prompt": "Analyze my pronunciation",
  "level": "intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcription": "I want to learn English",
    "response": "Great pronunciation! Your clarity is excellent.",
    "analysis": {
      "clarity": 0.92,
      "issues": ["'learn' - stress on first syllable"]
    }
  }
}
```

---

## User Service

### Register User

```http
POST /api/users/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "displayName": "John Doe",
  "level": "beginner",
  "nativeLanguage": "ru",
  "learningLanguage": "en"
}
```

### Login

```http
POST /api/users/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

---

## Scenarios Service

### Get All Scenarios

```http
GET /api/scenarios?level=intermediate&category=business
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "scenario-1",
      "title": "Job Interview",
      "description": "Practice professional interview skills",
      "category": "business",
      "level": "intermediate",
      "estimatedDuration": 15,
      "tags": ["interview", "professional", "career"],
      "objectives": ["Practice formal language", "Answer common questions"]
    }
  ]
}
```

---

## History Service

### Get Session History

```http
GET /api/history/sessions?userId=user123&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session-1",
      "userId": "user123",
      "startTime": "2024-01-15T10:00:00Z",
      "duration": 900,
      "messageCount": 15,
      "model": "gemini-2.0-flash-live",
      "metadata": {
        "feedback": { /* session feedback */ }
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 45,
    "hasMore": true
  }
}
```

---

## Recommendations Service

### Get Personalized Recommendations

```http
GET /api/recommendations?userId=user123
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec-1",
      "type": "scenario",
      "title": "Try Business Presentation scenario",
      "description": "Based on your progress, this will help improve formal speaking",
      "priority": "high",
      "metadata": {
        "scenarioId": "scenario-5"
      }
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* optional additional info */ }
  }
}
```

### Common Error Codes

- `INVALID_INPUT` (400) - Invalid request parameters
- `UNAUTHORIZED` (401) - Missing or invalid authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_SERVER_ERROR` (500) - Server error
- `SERVICE_UNAVAILABLE` (503) - Service temporarily unavailable

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1610000000
```

---

## WebSocket API

Connect to real-time dialogue:

```javascript
const socket = io('ws://localhost:3000', {
  auth: { token: 'your_jwt_token' }
});

// Join session
socket.emit('join-session', { sessionId: 'session-123' });

// Send message
socket.emit('message', { text: 'Hello!' });

// Receive response
socket.on('response', (data) => {
  console.log('AI:', data.text);
});

// Receive typing indicator
socket.on('typing', () => {
  console.log('AI is typing...');
});
```

---

## SDKs

### JavaScript/TypeScript

```bash
npm install @speakup-ai/sdk
```

```typescript
import { SpeakUpAI } from '@speakup-ai/sdk';

const client = new SpeakUpAI({
  apiKey: 'your_api_key',
  baseURL: 'http://localhost:3000'
});

const response = await client.dialogue.generate({
  prompt: 'Hello!',
  level: 'beginner'
});
```

---

## Examples

See [/examples](../examples/) directory for complete integration examples.
