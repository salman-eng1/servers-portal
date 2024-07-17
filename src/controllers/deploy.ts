import { createFile } from "@portal/services/create-file";
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

  try {

    await execute(`sed -i '/^Listen/d' /etc/apache2/ports.conf`, 'terminal');
    await execute(`cd /etc/apache2/sites-available && a2dissite *`, 'terminal');
    await execute(`rm /etc/apache2/sites-available/*`, 'terminal');

    const availableProjects = await systemProjects(systemName);
    let configContent = ``;
    let filePath = ``;

    for (const element of projects) {
      if (!availableProjects.includes(element.projectName)) {
        unavailableProjects.push(element.projectName);
      } else {
        if (element.update) {
          // Update project
          if (element.branchName) {
            await execute(`cd /var/www/${systemName}/${element.projectName} && git checkout ${element.branchName} && git pull ${element.gitlabUrl} ${element.branchName}`, 'terminal');
          } else {
            await execute(`cd /var/www/${systemName}/${element.projectName} && git pull ${element.gitlabUrl}`, 'terminal');
          }
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
        if (element.migrateFresh) {
          // Fresh migrate project
          await migrateFresh(systemName, element.projectName);
        }
        if (element.migrate) {
          // Migrate project
          await migrate(systemName, element.projectName);
        }
        await execute(`echo Listen ${element.port}  >> /etc/apache2/ports.conf`, 'terminal');
        configContent = `
    <VirtualHost *:${element.port}>
        DocumentRoot /var/www/${systemName}/${element.projectName}/public
        <Directory /var/www/${systemName}/${element.projectName}>
            AllowOverride All
            Order allow,deny
            allow from all
        </Directory>
        ErrorLog \${APACHE_LOG_DIR}/${element.projectName}_error.log
        CustomLog \${APACHE_LOG_DIR}/${element.projectName}_access.log combined
    </VirtualHost>
    `;
        filePath = `/etc/apache2/sites-available/${element.projectName}.conf`
        createFile(configContent, filePath)
      }
    }

    if (unavailableProjects.length === 0) {
      await execute(`cd /etc/apache2/sites-available && a2ensite *`, 'terminal');

      res.status(StatusCodes.OK).json({ message: 'Setup successful. All projects are available.' });
    } else {
      res.status(StatusCodes.OK).json({ message: `Please add projects [${unavailableProjects}] to /var/www` });
    }
  } catch (err) {
    logger.log('error', 'Error in setupProject()', `${err}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing request.' });
  }
};

