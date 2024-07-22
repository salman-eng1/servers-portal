import  {setupQmscripts} from "@portal/utils/scripts/qms";
import { execute } from "@portal/services/non-streamed-command"
import { migrate, migrateFresh, systemProjects } from "@portal/services/sharedHelper";
import { logger } from "@portal/utils/logging";
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

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
    const systemName = req.body.systemName
    const projectsArray: string[] = await systemProjects(systemName)
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
  try{
  const currentIP = (await execute("ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1", 'terminal')).trim();

//setup apache conf
  await execute(`cd /etc/apache2/sites-available && a2dissite *`, 'terminal');
  await execute(`composer config --global --auth http-basic.zeour.repo.repman.io token 882348531a5bbe88761dbb26c1d1ffa9a8c4ff518e4f3111e4b160f26f6927ed`, 'terminal');
  
  const availableProjects = await systemProjects(systemName);

  for (const element of projects) {
    if (!availableProjects.includes(element.projectName)) {
        unavailableProjects.push(element.projectName);
      } else {

        if (element.update) {
            await execute(`cd /var/www/${systemName}/${element.projectName} && git pull ${element.gitlabUrl}`, 'terminal');
        }
        if (element.composerInstall) {
          // Install composer
          await execute(`rm -r /var/www/${systemName}/${element.projectName}/vendor`, 'terminal');
          await execute(`cd /var/www/${systemName}/${element.projectName} && composer install`, 'terminal');
          await execute(`cd /var/www/${systemName}/${element.projectName} && composer dump-autoload`, 'terminal');
        }
        if (element.composerUpdate) {
          // Update composer
          await execute(`cd /var/www/${systemName}/${element.projectName} && composer update`, 'terminal');
        }
        if (element.migrateFresh) {
          // Fresh migrate project
          await migrateFresh(systemName, element.projectName);
        }
        if (element.migrate) {
          // Migrate project
          await migrate(systemName, element.projectName);
        }
        if (req.body.systemName === 'QMS') {
        await setupQmscripts(currentIP)
        }
      
      await execute(`bash /home/zeoor/scripts/permission.sh /var/www/${systemName} ${element.projectName}`, 'terminal');

      await execute(`cd /etc/apache2/sites-available && a2ensite ${element.projectName}`, 'terminal');

        }
      }
  
      if (unavailableProjects.length === 0) {
        await execute(`systemctl reload apache2`, 'terminal');
  
        res.set('Cache-Control', 'public, max-age=300'); // 1 hour TTL
        res.status(StatusCodes.OK).json({ message: 'Setup successful. All projects are available.' });
      } else {
        res.status(StatusCodes.OK).json({ message: `Please add projects [${unavailableProjects}] to /var/www` });
      }
    } catch (err) {
      logger.log('error', 'Error in setupProject()', `${err}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing request.' });
    }
  };
  