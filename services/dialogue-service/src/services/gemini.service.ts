import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GeminiModel, UserLevel, GeminiStreamOptions } from '@speakup-ai/types';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Gemini Service
 *
 * Manages integration with Google Gemini Live API.
 * Supports three models:
 * - gemini-2.0-flash-live: Fast dialogues (Beginner/Intermediate)
 * - gemini-2.5-flash-live: Advanced analysis (Advanced level)
 * - gemini-2.5-flash-native-audio-dialog: HD audio quality
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private models: Map<GeminiModel, GenerativeModel> = new Map();

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.initializeModels();
  }

  /**
   * Initialize all Gemini models
   */
  private initializeModels(): void {
    // Fast model for quick responses
    this.models.set(
      GeminiModel.FAST,
      this.genAI.getGenerativeModel({
        model: config.gemini.models.fast,
        generationConfig: {
          temperature: config.gemini.temperature,
          maxOutputTokens: config.gemini.maxTokens,
          topP: config.gemini.topP,
          topK: config.gemini.topK,
        },
      })
    );

    // Advanced model for detailed analysis
    this.models.set(
      GeminiModel.ADVANCED,
      this.genAI.getGenerativeModel({
        model: config.gemini.models.advanced,
        generationConfig: {
          temperature: config.gemini.temperature,
          maxOutputTokens: config.gemini.maxTokens,
          topP: config.gemini.topP,
          topK: config.gemini.topK,
        },
      })
    );

    // Native audio model for voice interactions
    this.models.set(
      GeminiModel.AUDIO,
      this.genAI.getGenerativeModel({
        model: config.gemini.models.audio,
        generationConfig: {
          temperature: config.gemini.temperature,
          maxOutputTokens: config.gemini.maxTokens,
        },
      })
    );

    logger.info('Gemini models initialized successfully');
  }

  /**
   * Select appropriate model based on user level and interaction type
   */
  selectModel(level: UserLevel, requiresAudio: boolean = false): GeminiModel {
    if (requiresAudio) {
      return GeminiModel.AUDIO;
    }

    switch (level) {
      case UserLevel.BEGINNER:
      case UserLevel.INTERMEDIATE:
        return GeminiModel.FAST;
      case UserLevel.ADVANCED:
        return GeminiModel.ADVANCED;
      default:
        return GeminiModel.FAST;
    }
  }

  /**
   * Generate response from Gemini
   */
  async generateResponse(
    prompt: string,
    model: GeminiModel,
    context?: string[]
  ): Promise<string> {
    try {
      const selectedModel = this.models.get(model);
      if (!selectedModel) {
        throw new Error(`Model ${model} not initialized`);
      }

      // Build conversation history
      const chat = selectedModel.startChat({
        history: context?.map((msg, idx) => ({
          role: idx % 2 === 0 ? 'user' : 'model',
          parts: [{ text: msg }],
        })) || [],
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      logger.debug({ model, prompt, response: text }, 'Generated response');

      return text;
    } catch (error) {
      logger.error({ error, model, prompt }, 'Failed to generate response');
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate streaming response from Gemini
   */
  async *generateStreamingResponse(
    prompt: string,
    model: GeminiModel,
    context?: string[]
  ): AsyncGenerator<string, void, unknown> {
    try {
      const selectedModel = this.models.get(model);
      if (!selectedModel) {
        throw new Error(`Model ${model} not initialized`);
      }

      const chat = selectedModel.startChat({
        history: context?.map((msg, idx) => ({
          role: idx % 2 === 0 ? 'user' : 'model',
          parts: [{ text: msg }],
        })) || [],
      });

      const result = await chat.sendMessageStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }

      logger.debug({ model, prompt }, 'Streaming response completed');
    } catch (error) {
      logger.error({ error, model, prompt }, 'Failed to generate streaming response');
      throw new Error(`Gemini streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze grammar and provide corrections
   */
  async analyzeGrammar(
    text: string,
    level: UserLevel
  ): Promise<{
    corrections: Array<{
      original: string;
      corrected: string;
      explanation: string;
      type: string;
    }>;
    overallFeedback: string;
  }> {
    const model = GeminiModel.ADVANCED;
    const selectedModel = this.models.get(model);

    if (!selectedModel) {
      throw new Error(`Model ${model} not initialized`);
    }

    const prompt = `You are an English language teacher. Analyze the following text for grammar, spelling, and usage errors.
User's level: ${level}

Text: "${text}"

Please provide:
1. A list of corrections in JSON format with fields: original, corrected, explanation, type (grammar/spelling/word_choice/sentence_structure)
2. Overall feedback and encouragement

Format your response as JSON:
{
  "corrections": [...],
  "overallFeedback": "..."
}`;

    try {
      const result = await selectedModel.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        corrections: [],
        overallFeedback: responseText,
      };
    } catch (error) {
      logger.error({ error, text }, 'Failed to analyze grammar');
      throw error;
    }
  }

  /**
   * Generate dialogue prompts based on scenario and level
   */
  async generateScenarioPrompt(
    scenario: string,
    level: UserLevel,
    objectives: string[]
  ): Promise<string> {
    const model = this.selectModel(level);
    const selectedModel = this.models.get(model);

    if (!selectedModel) {
      throw new Error(`Model ${model} not initialized`);
    }

    const prompt = `Create an engaging dialogue prompt for an English learning scenario.

Scenario: ${scenario}
Level: ${level}
Learning objectives: ${objectives.join(', ')}

Generate a natural, encouraging opening message that:
1. Sets the context
2. Is appropriate for ${level} level
3. Encourages the learner to respond
4. Incorporates the learning objectives naturally

Keep it conversational and friendly.`;

    try {
      const result = await selectedModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      logger.error({ error, scenario }, 'Failed to generate scenario prompt');
      throw error;
    }
  }

  /**
   * Generate session feedback and recommendations
   */
  async generateSessionFeedback(
    messages: Array<{ role: string; content: string }>,
    level: UserLevel
  ): Promise<{
    summary: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    scores: {
      grammar: number;
      vocabulary: number;
      fluency: number;
    };
  }> {
    const model = GeminiModel.ADVANCED;
    const selectedModel = this.models.get(model);

    if (!selectedModel) {
      throw new Error(`Model ${model} not initialized`);
    }

    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `Analyze this English learning conversation and provide detailed feedback.

Conversation:
${conversation}

User's level: ${level}

Provide feedback in JSON format:
{
  "summary": "Brief summary of the conversation",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["area 1", "area 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "scores": {
    "grammar": 0-100,
    "vocabulary": 0-100,
    "fluency": 0-100
  }
}`;

    try {
      const result = await selectedModel.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse feedback JSON');
    } catch (error) {
      logger.error({ error }, 'Failed to generate session feedback');
      throw error;
    }
  }

  /**
   * Process audio input (for native audio model)
   */
  async processAudioInput(
    audioData: Buffer,
    prompt: string,
    level: UserLevel
  ): Promise<{
    transcription: string;
    response: string;
    analysis?: any;
  }> {
    const model = GeminiModel.AUDIO;
    const selectedModel = this.models.get(model);

    if (!selectedModel) {
      throw new Error(`Model ${model} not initialized`);
    }

    try {
      // Convert audio buffer to base64
      const audioBase64 = audioData.toString('base64');

      const result = await selectedModel.generateContent([
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBase64,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      logger.debug({ model, audioLength: audioData.length }, 'Processed audio input');

      return {
        transcription: text,
        response: text,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to process audio input');
      throw error;
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();
