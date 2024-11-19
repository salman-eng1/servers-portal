import express, { Application } from 'express';
import path from 'path';
import { healthRoutes } from '@portal/routes/health';
import { troubleshootRoutes } from '@portal/routes/troubleshoot';
import { deployRoutes } from '@portal/routes/enable-system';
import { networkRoutes } from '@portal/routes/network-settings';
import { apache } from '@portal/routes/apache';
import { ports } from '@portal/routes/ports';
import { config } from '@portal/routes/configuration';


export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use('/api', troubleshootRoutes.routes());
  app.use('/api', deployRoutes.routes());
  app.use('/api', networkRoutes.routes());
  app.use('/api', ports.routes());
  app.use('/api', apache.routes());
  app.use('/api', config.routes());


  app.use(express.static(path.join(__dirname,'..', 'public')));
  // app.use(BASE_PATH, authRoutes.routes());

  // app.use(BASE_PATH, authRoutes.routes());
};
