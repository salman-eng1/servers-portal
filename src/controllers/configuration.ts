import { clearCache } from './../services/configuration';
import { logger } from "@portal/utils/logging";
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import { migrateFresh } from "@portal/services/configuration";

export const migrateProjetctDB = async (req: Request, res: Response): Promise<void> => {
  const systemName=req.body.systemName

  try {
    const response: string=await migrateFresh(systemName)
   
    if (!response){
      res.status(StatusCodes.OK).json({ message: `project with name ${systemName} is not available in your server`});
    }
    res.status(StatusCodes.OK).json({ message: response});
  } catch (err) {
    
    logger.log('error', `Failed to migrate ${systemName} database` )

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to migrate ${systemName} database` });
  }
};


export const clearProjectCache = async (req: Request, res: Response): Promise<void> => {
  const systemName=req.body.systemName

  try {
    const response: string=await clearCache(systemName)
   
    if (!response){
      res.status(StatusCodes.OK).json({ message: `project with name ${systemName} is not available in your server`});
    }
    res.status(StatusCodes.OK).json({ message: response});
  } catch (err) {
    
    logger.log('error', `Failed to clear ${systemName} cache` )

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to clear ${systemName} cache` });
  }
};