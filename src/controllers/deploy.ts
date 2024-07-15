import { execute } from "@portal/services/non-streamed-command"
import { migrate, migrateFresh, systemProjects } from "@portal/services/sharedHelper";
import { logger } from "@portal/utils/logging";
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";


// export const getApacheProjects=async (_req: Request, res: Response): Promise<void>=>{
// const projects= await execute("ls -l /var/www | awk '{print $9}'", 'terminal')
// console.log(projects)
// res.status(StatusCodes.OK).json({ message: projects });
// }

export const getSystems = async (_req: Request, res: Response): Promise<void> => {
      try {
        const projects = await execute("ls -l /var/www | grep '^d' | awk '{print $9}'", '');
        const projectsArray = projects.split('\n').filter(project => project.trim() !== '');
        res.status(StatusCodes.OK).json({ message: projectsArray });
      } catch (err) {
        logger.log('error', `Failed to retrieve projects`)

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve projects' });
      }
    };

    export const getSystemProjects = async (req: Request, res: Response): Promise<void> => {
      try {
            const systemName=req.body.systemName
        const projectsArray :string []=await systemProjects(systemName)
        res.status(StatusCodes.OK).json({ message: projectsArray });
      } catch (err) {
        logger.log('error', `Failed to retrieve sub projects`)

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve sub projects' });
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

    export const setupProject = async (req: Request, res: Response): Promise<void> => {
      const systemName: string = req.body.systemName;
      const projects: {
        projectName: string,
        domain: string,
        port: number,
        update: boolean,
        composerUpdate: boolean,
        composerInstall: boolean,
        migrate: boolean,
        migrateFresh: boolean,
        gitlabUrl: string,
        branchName: string
      }[] = req.body.projects;
    
      let unavailableProjects: string[] = [];
    
      try {
        const availableProjects = await systemProjects(systemName);
    
        for (const element of projects) {
          if (!availableProjects.includes(element.projectName)) {
            unavailableProjects.push(element.projectName);
          } else {
            if (element.update) {
              // Update project
              await execute(`cd /var/www/${systemName}/${element.projectName} && git checkout ${element.branchName} && git pull ${element.gitlabUrl} ${element.branchName}`, 'terminal');
            }
            if (element.migrateFresh) {
              // Fresh migrate project
              await migrateFresh(systemName, element.projectName);
            }
            if (element.migrate) {
              // Migrate project
              await migrate(systemName, element.projectName);
            }
            if (element.composerInstall) {
              // Install composer
              await execute(`rm -r /var/www/${systemName}/${element.projectName}/vendor`, 'terminal');
              await execute(`cd /var/www/${systemName}/${element.projectName} && composer install`, 'terminal');
            }
            if (element.composerUpdate) {
              // Update composer
              await execute(`cd /var/www/${systemName}/${element.projectName} && composer update`, 'terminal');
            }
          }
        }
    
        if (unavailableProjects.length === 0) {
          res.status(StatusCodes.OK).json({ message: 'Setup successful. All projects are available.' });
        } else {
          res.status(StatusCodes.OK).json({ message: `Please add projects [${unavailableProjects}] to /var/www` });
        }
      } catch (err) {
        logger.log('error', 'Error in setupProject()', `${err}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing request.' });
      }
    };

    