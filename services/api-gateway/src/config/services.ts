export const serviceConfig = {
  asr: {
    url: process.env.ASR_SERVICE_URL || 'http://localhost:3001',
    path: '/api/asr',
  },
  tts: {
    url: process.env.TTS_SERVICE_URL || 'http://localhost:3002',
    path: '/api/tts',
  },
  dialogue: {
    url: process.env.DIALOGUE_SERVICE_URL || 'http://localhost:3003',
    path: '/api/dialogue',
  },
  scenarios: {
    url: process.env.SCENARIOS_SERVICE_URL || 'http://localhost:3004',
    path: '/api/scenarios',
  },
  history: {
    url: process.env.HISTORY_SERVICE_URL || 'http://localhost:3005',
    path: '/api/history',
  },
  recommendations: {
    url: process.env.RECOMMENDATIONS_SERVICE_URL || 'http://localhost:3006',
    path: '/api/recommendations',
  },
  i18n: {
    url: process.env.I18N_SERVICE_URL || 'http://localhost:3007',
    path: '/api/i18n',
  },
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3008',
    path: '/api/users',
  },
};
