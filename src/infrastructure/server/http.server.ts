import config from 'config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { tokenDeserializer } from '@/infrastructure/server/middlewares/tokenDeserializer.middleware';
import { apiRoutes } from '@/infrastructure/server/routes.server';
import { errorHandler } from '@/infrastructure/server/middlewares/errorHandler.middleware';

const clientUri = config.get<string>('clientUri');

export const createHttpServer = () => {
  const app = express();

  // security
  app.use(helmet());

  // cors
  app.use(
    cors({
      origin: clientUri,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );

  // body parser
  app.use(express.json());

  // cookies
  app.use(cookieParser());

  // tokens
  app.use(tokenDeserializer);

  // health check
  app.get('/', (req, res) => res.send('API Boilerplate is up and running!'));

  // routes
  apiRoutes.forEach((route) => app.use(route));

  // error handling
  app.use(errorHandler);

  return app;
};
