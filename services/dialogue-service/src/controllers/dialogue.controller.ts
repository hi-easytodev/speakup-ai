import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { UserLevel, GeminiModel } from '@speakup-ai/types';
import { logger } from '../utils/logger';

export class DialogueController {
  /**
   * Generate AI response
   * POST /api/dialogue/generate
   */
  async generateResponse(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, level, context, requiresAudio } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Prompt is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const model = geminiService.selectModel(userLevel, requiresAudio);

      const response = await geminiService.generateResponse(
        prompt,
        model,
        context
      );

      res.json({
        success: true,
        data: {
          response,
          model,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to generate response');
      res.status(500).json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Generate streaming AI response
   * POST /api/dialogue/stream
   */
  async generateStreamingResponse(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, level, context, requiresAudio } = req.body;

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Prompt is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const model = geminiService.selectModel(userLevel, requiresAudio);

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial metadata
      res.write(
        `data: ${JSON.stringify({ type: 'start', model, timestamp: new Date() })}\n\n`
      );

      // Stream response
      const generator = geminiService.generateStreamingResponse(
        prompt,
        model,
        context
      );

      for await (const chunk of generator) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      // Send completion
      res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
      res.end();
    } catch (error) {
      logger.error({ error }, 'Failed to generate streaming response');
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })}\n\n`
      );
      res.end();
    }
  }

  /**
   * Analyze grammar
   * POST /api/dialogue/analyze
   */
  async analyzeGrammar(req: Request, res: Response): Promise<void> {
    try {
      const { text, level } = req.body;

      if (!text) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Text is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const analysis = await geminiService.analyzeGrammar(text, userLevel);

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to analyze grammar');
      res.status(500).json({
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Generate scenario prompt
   * POST /api/dialogue/scenario
   */
  async generateScenarioPrompt(req: Request, res: Response): Promise<void> {
    try {
      const { scenario, level, objectives } = req.body;

      if (!scenario) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Scenario is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const prompt = await geminiService.generateScenarioPrompt(
        scenario,
        userLevel,
        objectives || []
      );

      res.json({
        success: true,
        data: { prompt },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to generate scenario prompt');
      res.status(500).json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Generate session feedback
   * POST /api/dialogue/feedback
   */
  async generateFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { messages, level } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Messages array is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const feedback = await geminiService.generateSessionFeedback(
        messages,
        userLevel
      );

      res.json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to generate feedback');
      res.status(500).json({
        success: false,
        error: {
          code: 'FEEDBACK_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Process audio input
   * POST /api/dialogue/audio
   */
  async processAudio(req: Request, res: Response): Promise<void> {
    try {
      // Note: This would require multer or similar for file upload
      const { audioData, prompt, level } = req.body;

      if (!audioData) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Audio data is required' },
        });
        return;
      }

      const userLevel = (level as UserLevel) || UserLevel.BEGINNER;
      const buffer = Buffer.from(audioData, 'base64');

      const result = await geminiService.processAudioInput(
        buffer,
        prompt || 'Transcribe and respond to this audio.',
        userLevel
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to process audio');
      res.status(500).json({
        success: false,
        error: {
          code: 'AUDIO_PROCESSING_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  /**
   * Health check
   * GET /health
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      data: {
        service: 'dialogue-service',
        status: 'healthy',
        timestamp: new Date(),
      },
    });
  }
}

export const dialogueController = new DialogueController();
