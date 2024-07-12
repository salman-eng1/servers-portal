import express, { Application } from 'express';
import path from 'path';
import { healthRoutes } from '@portal/routes/health';
import { troubleshootRoutes } from './routes/troubleshoot';
import { deployRoutes } from './routes/deploy';


export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use('/api', troubleshootRoutes.routes());
  app.use('/api', deployRoutes.routes());

  app.use(express.static(path.join(__dirname,'..', 'public')));

  // app.use(BASE_PATH, authRoutes.routes());
};
