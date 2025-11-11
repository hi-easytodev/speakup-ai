// ==================== Common Types ====================

export enum UserLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Language {
  EN = 'en',
  RU = 'ru',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  ZH = 'zh',
}

export enum GeminiModel {
  FAST = 'gemini-2.0-flash-live',
  ADVANCED = 'gemini-2.5-flash-live',
  AUDIO = 'gemini-2.5-flash-native-audio-dialog',
}

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  level: UserLevel;
  nativeLanguage: Language;
  learningLanguage: Language;
  interfaceLanguage: Language;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
  avatarUrl?: string;
  settings: UserSettings;
  progress: UserProgress;
}

export interface UserSettings {
  voiceEnabled: boolean;
  textEnabled: boolean;
  autoCorrection: boolean;
  difficulty: UserLevel;
  dailyGoalMinutes: number;
  notifications: boolean;
  preferredVoice?: string;
  speechRate: number; // 0.5 - 2.0
}

export interface UserProgress {
  totalSessionsCount: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  vocabularySize: number;
  grammarScore: number; // 0-100
  pronunciationScore: number; // 0-100
  fluencyScore: number; // 0-100
  lastSessionDate?: Date;
}

// ==================== Dialogue Types ====================

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum MessageType {
  TEXT = 'text',
  AUDIO = 'audio',
  MULTIMODAL = 'multimodal',
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  audioUrl?: string;
  transcript?: string;
  timestamp: Date;
  metadata?: MessageMetadata;
  corrections?: GrammarCorrection[];
}

export interface MessageMetadata {
  duration?: number; // seconds
  language?: string;
  confidence?: number; // 0-1
  emotion?: string;
  modelUsed?: GeminiModel;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  type: CorrectionType;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

export enum CorrectionType {
  GRAMMAR = 'grammar',
  SPELLING = 'spelling',
  PRONUNCIATION = 'pronunciation',
  WORD_CHOICE = 'word_choice',
  SENTENCE_STRUCTURE = 'sentence_structure',
}

// ==================== Session Types ====================

export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface Session {
  id: string;
  userId: string;
  scenarioId?: string;
  status: SessionStatus;
  level: UserLevel;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  messageCount: number;
  model: GeminiModel;
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  topic?: string;
  goals?: string[];
  achievements?: Achievement[];
  summary?: string;
  feedback?: SessionFeedback;
}

export interface SessionFeedback {
  overallScore: number; // 0-100
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  icon?: string;
}

// ==================== Scenario Types ====================

export enum ScenarioCategory {
  DAILY_CONVERSATION = 'daily_conversation',
  BUSINESS = 'business',
  TRAVEL = 'travel',
  ACADEMIC = 'academic',
  PRESENTATION = 'presentation',
  INTERVIEW = 'interview',
  CASUAL = 'casual',
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  level: UserLevel;
  estimatedDuration: number; // minutes
  tags: string[];
  objectives: string[];
  vocabulary: VocabularyItem[];
  context: string;
  suggestedPrompts: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  definition: string;
  examples: string[];
  partOfSpeech: string;
  difficulty: UserLevel;
  audioUrl?: string;
}

// ==================== API Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== Gemini API Types ====================

export interface GeminiConfig {
  apiKey: string;
  projectId?: string;
  model: GeminiModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  enableStreaming?: boolean;
}

export interface GeminiStreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export interface AudioConfig {
  sampleRate: number;
  encoding: string;
  languageCode: string;
  maxDuration?: number;
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
  duration: number;
  alternatives?: TranscriptAlternative[];
}

export interface TranscriptAlternative {
  transcript: string;
  confidence: number;
}

export interface SynthesisOptions {
  voice?: string;
  languageCode: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
}

// ==================== Analytics Types ====================

export interface UserAnalytics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'all';
  stats: {
    totalSessions: number;
    totalMinutes: number;
    averageSessionDuration: number;
    messagesSent: number;
    messagesReceived: number;
    vocabularyLearned: number;
    mistakesCorrected: number;
  };
  scores: {
    grammar: number[];
    pronunciation: number[];
    fluency: number[];
    vocabulary: number[];
  };
  trends: {
    date: string;
    minutes: number;
    sessions: number;
    score: number;
  }[];
}

// ==================== WebSocket Types ====================

export enum WebSocketEventType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  AUDIO_CHUNK = 'audio_chunk',
  TRANSCRIPTION = 'transcription',
  RESPONSE = 'response',
  ERROR = 'error',
  TYPING = 'typing',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
}

export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: any;
  timestamp: Date;
  sessionId?: string;
}

// ==================== Recommendation Types ====================

export interface Recommendation {
  id: string;
  userId: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
  metadata?: {
    scenarioId?: string;
    vocabularyWords?: string[];
    grammarTopics?: string[];
  };
}

export enum RecommendationType {
  SCENARIO = 'scenario',
  VOCABULARY = 'vocabulary',
  GRAMMAR_TOPIC = 'grammar_topic',
  PRACTICE_AREA = 'practice_area',
  ACHIEVEMENT = 'achievement',
}

// ==================== Export all types ====================

export * from './index';
