import { Request, Response } from "express";
import {updateNetplanIP} from '@portal/services/network-settings'
import { logger } from "@portal/utils/logging";
import { StatusCodes } from "http-status-codes";

export const changeNetworkSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    updateNetplanIP(req.body.ip, req.body.mask, req.body.dns)
    res.status(StatusCodes.OK).json({message: "server IP has been set successfully"})
  } catch (error) {
    logger.log('error','error in updateNetplanIp() method',`Failed to update netplan configuration: ${error}`);
    res.status(StatusCodes.BAD_REQUEST).json({message: `coldn't change server ip, please try again, ${error}`})
  }
};