import Config from 'react-native-config';

export const API_CONFIG = {
  BASE_URL: Config.API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  ENDPOINTS: {
    DIALOGUE: '/api/dialogue',
    ASR: '/api/asr',
    TTS: '/api/tts',
    SCENARIOS: '/api/scenarios',
    HISTORY: '/api/history',
    RECOMMENDATIONS: '/api/recommendations',
    I18N: '/api/i18n',
    USERS: '/api/users',
  },
};

export const WS_CONFIG = {
  URL: Config.WS_URL || 'ws://localhost:3000',
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
};
