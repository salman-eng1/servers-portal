import { execute } from "@portal/services/non-streamed-command";
import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";



export const checkServices=async(_req: Request,res: Response): Promise<void> =>{
execute('systemctl status apache2 | head -n 3', 'terminal');
execute('systemctl status cron | head -n 3','terminal')
execute('systemctl status redis','terminal')
execute('systemctl status mysql','terminal')
res.status(StatusCodes.OK).json({ message: 'Check Services done Successfully' });
}

export const checkPorts=async (_req: Request,res: Response): Promise<void> =>{
    execute('netstat -lptun', 'terminal');
    res.status(StatusCodes.OK).json({ message: 'Check Ports Done Successfully' });
}