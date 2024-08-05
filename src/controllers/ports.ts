import { getPorts } from '@portal/services/sharedHelper';
import { logger } from '@portal/utils/logging';
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';

export const getSystemPorts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ports = await getPorts(_req.body.systemName)
      
      res.status(StatusCodes.OK).json({ message: ports });
    } catch (err) {
      logger.log('error', `Failed to retrieve enabled projects`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve ports' });
    }
  };