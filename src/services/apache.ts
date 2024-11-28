import { subSystemProjects } from "@portal/services/sharedHelper";
import { execute } from "@portal/services/non-streamed-command";
import { deletePorts,addPorts, deleteProjectPorts } from "@portal/services/ports";
import { promises as fs } from 'fs';
import { crontab, crontabCreate } from "@portal/utils/env-files/crontab";
import { appendToFile } from "@portal/services/create-file";

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
      const cronCreateData = await crontabCreate();
      await fs.writeFile('/etc/crontab', cronCreateData, 'utf-8'); // Ensure this completes before appending
     
      await execute('echo Listen 5500 >> /etc/apache2/ports.conf', 'terminal');


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
 // Create the crontab file with the necessary content
 const crondata: string = await crontab(systemName) as string;
 const cronCreateData = await crontabCreate();
 
if (deleteAll){
  await fs.writeFile('/etc/crontab', cronCreateData, 'utf-8'); // Ensure this completes before appending
}

 // Append additional crontab data
 await appendToFile('/etc/crontab', crondata); // Await to ensure it completes properly

    await execute('systemctl restart apache2','')

    return enabledProjects;
  }