import express, { Application, Request, Response, NextFunction } from 'express';
import config from './config/config';
import helmet from 'helmet';
import { RateLimiterMemory } from "rate-limiter-flexible";
import bodyParser from 'body-parser';

export default class App {
  protected app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private getRateLimits() {
    const rateLimiter = new RateLimiterMemory({
      keyPrefix: 'middleware',
      points: 10, // 10 requests
      duration: 1, // per 1 second by IP
    });
    const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
      rateLimiter.consume(req.ip)
        .then(() => {
          next();
        })
        .catch(() => {
          res.status(429).send('Too Many Requests');
        });
    };
    return rateLimiterMiddleware;
  }

  private config(): void {
    this.app.use(helmet());
    this.app.disable('x-powered-by');
    this.app.use(this.getRateLimits());
    this.app.use(bodyParser.json({ limit: '1mb' }));
  }

  public listen(): void {
    this.app.listen(config.PORT, () => console.log(`Server is listening on port ${config.PORT}!`));
  }
}
