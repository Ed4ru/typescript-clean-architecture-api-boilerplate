import dotenv from 'dotenv';
dotenv.config();
import config from 'config';

import { createHttpServer } from '@/infrastructure/server/http.server';

const port = config.get<number>('port');
const apiUri = config.get<string>('apiUri');

const app = createHttpServer();

const httpServer = app.listen(port, async () => {
  console.info(`API is running on: ${apiUri}, port: ${port}`);
});

const shutdown = (signal: string) => {
  return (err: any) => {
    console.info(`${signal} signal received. Shutting down gracefully...`);
    httpServer.close(() => {
      console.info('Server closed');
      process.exit(err ? 1 : 0);
    });
  };
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
process.on('uncaughtException', shutdown('uncaughtException'));
process.on('unhandledRejection', shutdown('unhandledRejection'));
