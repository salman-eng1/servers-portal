import { createFile } from "@portal/services/create-file";
import { execute } from "@portal/services/non-streamed-command"
import { migrate, migrateFresh, subSystemProjects, systemProjects } from "@portal/services/sharedHelper";
import { logger } from "@portal/utils/logging";
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

export const getSystems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await execute("ls -l /var/www | grep '^d' | awk '{print $9}'", '');
    const projectsArrayTemp = projects.split('\n').filter(project => project.trim() !== '');
    const projectsArray: string[]=[];
    projectsArrayTemp.forEach(project => {
      if (project != 'server-portal'){
        projectsArray.push(project);
      }
    })
    res.status(StatusCodes.OK).json({ message: projectsArray });
  } catch (err) {
    logger.log('error', `Failed to retrieve projects`)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve projects' });
  }
};

export const getSystemProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const systemName = req.body.systemName
    const projectsArray: string[] = await subSystemProjects(systemName)
    res.status(StatusCodes.OK).json({ message: projectsArray });
  } catch (err) {
    logger.log('error', `Failed to retrieve sub projects`)

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve sub projects' });
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
    const currentIP = (await execute("ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1", 'terminal')).trim();
    console.log(currentIP, currentIP);

    await execute(`sed -i '/^Listen/d' /etc/apache2/ports.conf`, 'terminal');
    await execute(`cd /etc/apache2/sites-available && a2dissite *`, 'terminal');
    await execute(`rm /etc/apache2/sites-available/*`, 'terminal');
    await execute(`composer config --global --auth http-basic.zeour.repo.repman.io token 882348531a5bbe88761dbb26c1d1ffa9a8c4ff518e4f3111e4b160f26f6927ed`, 'terminal');

    const availableProjects = await systemProjects(systemName);
    let configContent = ``;
    let filePath = ``;

    for (const element of projects) {
      if (!availableProjects.includes(element.projectName)) {
        unavailableProjects.push(element.projectName);
      } else {
        // Update project
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

          await execute(`echo Listen ${element.port} >> /etc/apache2/ports.conf`, 'terminal');
          await execute(`sed -i "s|^APP_URL=http://.*|APP_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/${element.projectName}/.env"`, 'terminal');
          if (req.body.systemName === 'QMS') {
            if (element.projectName === 'msa') {
              await execute(`sed -i "s|^MSA_URL=http://.*|MSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
              await execute(`sed -i "s|^APP_URL=http://.*|APP_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/${element.projectName}/.env"`, 'terminal');
              await execute(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/cron*.sh"`, 'terminal');
              await execute(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/reset.sh"`, 'terminal');
            } else if (element.projectName === 'ems') {
              await execute(`sed -i "s|^EMS_URL=http://.*|EMS_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
              await execute(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/cronincb.sh"`, 'terminal');
            } else if (element.projectName === 'csa') {
              await execute(`sed -i "s|^CSA_URL=http://.*|CSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
            } else if (element.projectName === 'display') {
              await execute(`sed -i "s|^DSA_URL=http://.*|DSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
            } else if (element.projectName === 'keypad') {
              await execute(`sed -i "s|^keypad_URL=http://.*|keypad_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
            } else if (element.projectName === 'MobileWCSA') {
              await execute(`sed -i "s|^MOBILE_URL=http://.*|MOBILE_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
            }
          }
        
        await execute(`bash /home/zeour/scripts/permission.sh /var/www/${systemName}/${element.projectName}`, 'terminal');

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
        createFile(configContent, filePath, 0o644)
      }
    }

    if (unavailableProjects.length === 0) {
      await execute(`cd /etc/apache2/sites-available && a2ensite *`, 'terminal');
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
