import { subSystemProjects } from "@portal/services/sharedHelper";
import { execute } from "./non-streamed-command";
import { deletePorts,addPorts, deleteProjectPorts } from "@portal/services/ports";
import { promises as fs } from 'fs';
import { crontab } from "@portal/utils/env-files/crontab";

export const disableSystem = async (systemName: string,deleteAll:boolean): Promise<string[]> => {
    const projects: string[] = await subSystemProjects(systemName);
  
    const disabledProjects: string[] = await Promise.all(
      projects.map(async (project) => {
        if(deleteAll){
         const  disableCommand = `cd /etc/apache2/sites-enabled && rm *.conf`;
         const  enableServerPortal = `cd /etc/apache2/sites-available && a2ensite server-portal.conf`;

         await execute(disableCommand, 'terminal');
         await execute(enableServerPortal, 'terminal');


        }else{
         const  disableCommand = `cd /etc/apache2/sites-enabled && unlink ${project}.conf`;
         await execute(disableCommand, 'terminal');


        }
          return project;
      })
    );

    if (deleteAll){
      await deletePorts()
      await execute('echo Lisen 5500 > /etc/apache2/ports.conf', 'terminal');


    }else{
      await deleteProjectPorts(systemName)
    }
    await execute(`sudo sed -i '/${systemName}/d' /etc/crontab`, '');

    await execute('systemctl restart apache2','')
    return disabledProjects;
  }


  export const enableSystem = async (systemName: string,deleteAll:boolean): Promise<string[]> => {
    disableSystem(systemName,deleteAll)
    const projects: string[] = await subSystemProjects(systemName);
    const enabledProjects: string[] = await Promise.all(
      projects.map(async (project) => {
        const enableCommand = `cd /etc/apache2/sites-available && a2ensite ${project}.conf`;
          await execute(enableCommand, 'terminal');
          return project;
      })
    );
    await addPorts(systemName)
    const crondata: string=await crontab(systemName) as string
    await fs.writeFile('/etc/crontab', crondata, 'utf-8');
    await execute('systemctl restart apache2','')

    return enabledProjects;
  }