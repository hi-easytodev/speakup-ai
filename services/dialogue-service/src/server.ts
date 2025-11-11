import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import routes from './routes';

export class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Security
    this.app.use(helmet());

    // CORS
    this.app.use(cors(config.cors));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info({
        method: req.method,
        path: req.path,
        ip: req.ip,
      }, 'Incoming request');
      next();
    });
  }

  private configureRoutes(): void {
    this.app.use('/', routes);

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${req.method} ${req.path} not found`,
        },
      });
    });
  }

  private configureErrorHandling(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error({ error: err, path: req.path }, 'Unhandled error');

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: config.nodeEnv === 'production'
            ? 'An unexpected error occurred'
            : err.message,
        },
      });
    });
  }

  public async start(): Promise<void> {
    try {
      this.app.listen(config.port, () => {
        logger.info(
          {
            port: config.port,
            env: config.nodeEnv,
          },
          '🚀 Dialogue Service started successfully'
        );
      });
    } catch (error) {
      logger.error({ error }, 'Failed to start server');
      process.exit(1);
    }
  }

  public getApp(): Express {
    return this.app;
  }
}
