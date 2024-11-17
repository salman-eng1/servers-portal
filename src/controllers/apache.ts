import { disableSystem, enableSystem } from "@portal/services/apache";
import { execute } from "@portal/services/non-streamed-command";
import { logger } from "@portal/utils/logging";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const enableSys = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body)

      const systemName = req.body.systemName
      const deleteAll:boolean=req.body.deleteAll
      const enabledSystem: string[] = await enableSystem(systemName,deleteAll)
      res.status(StatusCodes.OK).json({ message: enabledSystem });
      
    } catch (err) {
      logger.log('error', `Failed to retrieve enable system`)
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to enable system' });
    }
  };



  export const disableSys = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body)

      const systemName = req.body.systemName
      const deleteAll:boolean=req.body.deleteAll
      const disabledSystem: string[] = await disableSystem(systemName,deleteAll)
      res.status(StatusCodes.OK).json({ message: disabledSystem });
    } catch (err) {
      logger.log('error', `Failed to disable system`)
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to disable system' });
    }
  };


  export const getEnabledProjects = async (_req: Request, res: Response): Promise<void> => {
    try {
      const projects = await execute("ls -l /etc/apache2/sites-enabled | awk '{print $9}'", '');
      const enabledProjectsArray = projects.split('\n').filter(project => project.trim() !== '');
      res.status(StatusCodes.OK).json({ message: enabledProjectsArray });
    } catch (err) {
      logger.log('error', `Failed to retrieve enabled projects`)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve enabled projects' });
    }
  };