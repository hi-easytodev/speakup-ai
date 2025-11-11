import { Router } from 'express';
import { dialogueController } from '../controllers/dialogue.controller';

const router = Router();

// Health check
router.get('/health', dialogueController.healthCheck.bind(dialogueController));

// Dialogue routes
router.post('/api/dialogue/generate', dialogueController.generateResponse.bind(dialogueController));
router.post('/api/dialogue/stream', dialogueController.generateStreamingResponse.bind(dialogueController));
router.post('/api/dialogue/analyze', dialogueController.analyzeGrammar.bind(dialogueController));
router.post('/api/dialogue/scenario', dialogueController.generateScenarioPrompt.bind(dialogueController));
router.post('/api/dialogue/feedback', dialogueController.generateFeedback.bind(dialogueController));
router.post('/api/dialogue/audio', dialogueController.processAudio.bind(dialogueController));

export default router;
