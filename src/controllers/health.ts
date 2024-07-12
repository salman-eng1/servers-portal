import { StatusCodes } from "http-status-codes";
import { Request,Response } from "express";
export class Health{
    public health(_req: Request, res: Response){
res.status(StatusCodes.OK).send('portal is Healthy and OK');
    }
}

