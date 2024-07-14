import { execute } from "@portal/services/non-streamed-command"
import { systemProjects } from "@portal/services/sharedHelper";
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";


// export const getApacheProjects=async (_req: Request, res: Response): Promise<void>=>{
// const projects= await execute("ls -l /var/www | awk '{print $9}'", 'terminal')
// console.log(projects)
// res.status(StatusCodes.OK).json({ message: projects });
// }

export const getSystems = async (_req: Request, res: Response): Promise<void> => {
      try {
        const projects = await execute("ls -l /var/www | grep '^d' | awk '{print $9}'", 'terminal');
        const projectsArray = projects.split('\n').filter(project => project.trim() !== '');
        res.status(StatusCodes.OK).json({ message: projectsArray });
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve projects' });
      }
    };

    export const getSystemProjects = async (req: Request, res: Response): Promise<void> => {
      try {
            const systemName=req.body.systemName
        const projectsArray :string []=await systemProjects(systemName)
        res.status(StatusCodes.OK).json({ message: projectsArray });
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve sub projects' });
      }
    };



    export const getEnabledProjects = async (_req: Request, res: Response): Promise<void> => {
      try {
        const projects = await execute("ls -l /etc/apache2/sites-enabled | awk '{print $9}'", 'terminal');
        const enabledProjectsArray = projects.split('\n').filter(project => project.trim() !== '');
        res.status(StatusCodes.OK).json({ message: enabledProjectsArray });
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve enabled projects' });
      }
    };


    export const setupProject=async (req: Request, res: Response): Promise<void>=>{
      //  const system: string=req.body.system
      const projects: { projectName: string, domain: string, port: number, update: boolean, migrate: boolean, gitlabUrl:string,branchName:string }[] = req.body.projects;     
//       const gitlabUsername: string = req.body.gitlabUsername;
//       const token: string = req.body.token;
//       const isHttps: boolean = req.body.isHttps;
// const installedrojects=getSystemProjects()

const availableProjects = await systemProjects(req.body.systemName)
      projects.forEach(element => {
            if (availableProjects.includes(element.projectName)) {
                                    console.log('hi')

            }

      });

       res.status(StatusCodes.OK).json({ message: 'setup done successfully' });
       }


    