import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { serviceConfig } from './config/services';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'api-gateway',
      status: 'healthy',
      timestamp: new Date(),
      services: Object.keys(serviceConfig),
    },
  });
});

// API Documentation endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'SpeakUp AI API',
      version: '1.0.0',
      description: 'Microservices API Gateway for SpeakUp AI',
      endpoints: {
        asr: `${serviceConfig.asr.path}/*`,
        tts: `${serviceConfig.tts.path}/*`,
        dialogue: `${serviceConfig.dialogue.path}/*`,
        scenarios: `${serviceConfig.scenarios.path}/*`,
        history: `${serviceConfig.history.path}/*`,
        recommendations: `${serviceConfig.recommendations.path}/*`,
        i18n: `${serviceConfig.i18n.path}/*`,
        users: `${serviceConfig.user.path}/*`,
      },
      documentation: '/api/docs',
    },
  });
});

// Service proxies
Object.entries(serviceConfig).forEach(([serviceName, config]) => {
  app.use(
    config.path,
    createProxyMiddleware({
      target: config.url,
      changeOrigin: true,
      pathRewrite: {
        [`^${config.path}`]: '',
      },
      onError: (err, req, res) => {
        console.error(`[${serviceName}] Proxy error:`, err.message);
        (res as Response).status(503).json({
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: `${serviceName} service is currently unavailable`,
            service: serviceName,
          },
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[${serviceName}] ${req.method} ${req.path}`);
      },
    })
  );
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📋 API Info: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('\n📡 Proxying to services:');
  Object.entries(serviceConfig).forEach(([name, config]) => {
    console.log(`  - ${name.padEnd(15)} ${config.path.padEnd(25)} → ${config.url}`);
  });
});
