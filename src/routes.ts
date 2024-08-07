import express, { Application } from 'express';
import path from 'path';
import { healthRoutes } from '@portal/routes/health';
import { troubleshootRoutes } from '@portal/routes/troubleshoot';
import { deployRoutes } from '@portal/routes/enable-system';
import { networkRoutes } from '@portal/routes/network-settings';
import { ports } from '@portal/routes/ports';


export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use('/api', troubleshootRoutes.routes());
  app.use('/api', deployRoutes.routes());
  app.use('/api', networkRoutes.routes());
  app.use('/api', ports.routes());


  app.use(express.static(path.join(__dirname,'..', 'public')));
  // app.use(BASE_PATH, authRoutes.routes());

  // app.use(BASE_PATH, authRoutes.routes());
};
