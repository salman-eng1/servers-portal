import { execute } from "@portal/services/non-streamed-command";
import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";



export const checkServices=async(_req: Request,res: Response): Promise<void> =>{
execute('systemctl status apache2 | head -n 3', 'checkServices');
execute('systemctl status cron | head -n 3','checkServices')
execute('systemctl status redis','checkServices')
execute('systemctl status mysql','checkServices')
res.status(StatusCodes.OK).json({ message: 'Check Services done Successfully' });
}

export const checkPorts=async (_req: Request,res: Response): Promise<void> =>{
    execute('netstat -lptun', 'checkPorts');
    res.status(StatusCodes.OK).json({ message: 'Check Ports Done Successfully' });
}