import { geminiService } from '../services/gemini.service';
import { UserLevel, GeminiModel } from '@speakup-ai/types';

describe('GeminiService', () => {
  describe('selectModel', () => {
    it('should select FAST model for beginner level', () => {
      const model = geminiService.selectModel(UserLevel.BEGINNER);
      expect(model).toBe(GeminiModel.FAST);
    });

    it('should select FAST model for intermediate level', () => {
      const model = geminiService.selectModel(UserLevel.INTERMEDIATE);
      expect(model).toBe(GeminiModel.FAST);
    });

    it('should select ADVANCED model for advanced level', () => {
      const model = geminiService.selectModel(UserLevel.ADVANCED);
      expect(model).toBe(GeminiModel.ADVANCED);
    });

    it('should select AUDIO model when audio is required', () => {
      const model = geminiService.selectModel(UserLevel.BEGINNER, true);
      expect(model).toBe(GeminiModel.AUDIO);
    });
  });

  describe('generateResponse', () => {
    it('should generate response for simple prompt', async () => {
      const response = await geminiService.generateResponse(
        'Say hello',
        GeminiModel.FAST
      );

      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should handle context in conversation', async () => {
      const context = [
        'Hello, I want to learn English',
        'Great! What would you like to practice?'
      ];

      const response = await geminiService.generateResponse(
        'I want to practice ordering food',
        GeminiModel.FAST,
        context
      );

      expect(response).toBeTruthy();
      expect(response).toContain('food' || 'restaurant' || 'order');
    });

    it('should throw error with invalid model', async () => {
      await expect(
        geminiService.generateResponse(
          'test',
          'invalid-model' as GeminiModel
        )
      ).rejects.toThrow();
    });
  });

  describe('analyzeGrammar', () => {
    it('should detect grammar errors', async () => {
      const analysis = await geminiService.analyzeGrammar(
        'I goes to school yesterday',
        UserLevel.BEGINNER
      );

      expect(analysis).toHaveProperty('corrections');
      expect(analysis).toHaveProperty('overallFeedback');
      expect(Array.isArray(analysis.corrections)).toBe(true);

      if (analysis.corrections.length > 0) {
        expect(analysis.corrections[0]).toHaveProperty('original');
        expect(analysis.corrections[0]).toHaveProperty('corrected');
        expect(analysis.corrections[0]).toHaveProperty('explanation');
      }
    });

    it('should return empty corrections for correct text', async () => {
      const analysis = await geminiService.analyzeGrammar(
        'I went to school yesterday',
        UserLevel.BEGINNER
      );

      expect(analysis.corrections.length).toBe(0);
    });
  });

  describe('generateScenarioPrompt', () => {
    it('should generate scenario prompt', async () => {
      const prompt = await geminiService.generateScenarioPrompt(
        'Job Interview',
        UserLevel.INTERMEDIATE,
        ['Practice professional language', 'Answer common questions']
      );

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(20);
    });
  });

  describe('generateSessionFeedback', () => {
    it('should generate feedback for session', async () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi! How can I help?' },
        { role: 'user', content: 'I want to practice English' }
      ];

      const feedback = await geminiService.generateSessionFeedback(
        messages,
        UserLevel.BEGINNER
      );

      expect(feedback).toHaveProperty('summary');
      expect(feedback).toHaveProperty('strengths');
      expect(feedback).toHaveProperty('improvements');
      expect(feedback).toHaveProperty('recommendations');
      expect(feedback).toHaveProperty('scores');

      expect(feedback.scores.grammar).toBeGreaterThanOrEqual(0);
      expect(feedback.scores.grammar).toBeLessThanOrEqual(100);
    });
  });
});
