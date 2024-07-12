import { execute } from "@portal/services/non-streamed-command"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";


export const getApacheProjects=async (_req: Request, res: Response): Promise<void>=>{
const project= await execute("ls -l /var/www | awk '{print $9}'", 'checkPorts')

res.status(StatusCodes.OK).json({ message: project });
}


export const getEnabledProjects=async (_req: Request, res: Response): Promise<void>=>{
   await execute("ls -l /etc/apache2/sites-enabled | awk '{print $9}'", 'checkPorts')
   await  execute("cat /etc/apache2/ports.conf", 'checkPorts')

    res.status(StatusCodes.OK).json({ message: 'projects have been gotten successfully' });
    }

    export const setupProject=async (req: Request, res: Response): Promise<void>=>{
      //  const system: string=req.body.system
      const projects: { projectName: string, domain: string, port: number, update: boolean, migrate: boolean, gitlabUrl:string,branchName:string }[] = req.body.projects;      // const ishttps: boolean = req.body.isHttps
      // const gitlabUsername: string = req.body.gitlabUsername,
      // const token: string = req.body.token

      projects.forEach(element => {
console.log(element.branchName)

      });

       res.status(StatusCodes.OK).json({ message: 'setup done successfully' });
       }


    