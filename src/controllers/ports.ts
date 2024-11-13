import { addPorts, deletePorts, getPorts } from '@portal/services/ports';
import { logger } from '@portal/utils/logging';
import { Request, Response } from "express"
import { StatusCodes } from 'http-status-codes';

export const getSystemPorts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ports = await getPorts(_req.body.systemName)
      console.log(ports)

      res.status(StatusCodes.OK).json({ message: ports });
    } catch (err) {
      logger.log('error', `Failed to retrieve enabled projects`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve ports' });
    }
  };

  export const addSystemPorts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ports = await addPorts(_req.body.systemName)
      
      res.status(StatusCodes.OK).json({ message: ports });
    } catch (err) {
      logger.log('error', `Failed to add projects ports`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add ports' });
    }
  };


  export const deleteSystemPorts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const deletedPorts = await deletePorts()
      
      res.status(StatusCodes.OK).json({ message: deletedPorts });
    } catch (err) {
      logger.log('error', `Failed to disable projects projects ports`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to disable ports' });
    }
  };