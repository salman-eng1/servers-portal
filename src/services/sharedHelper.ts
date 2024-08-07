import { execute } from "@portal/services/non-streamed-command"

export const systemProjects=async(systemName:string): Promise<string[]> => {
const projects = await execute(`ls -l /var/www/${systemName} | grep '^d' | awk '{print $9}'`, '');
const projectsArray = projects.split('\n').filter(project => project.trim() !== '');
return projectsArray as string[];
    }


export const migrate=async(systemName:string, projectName:string): Promise<void> => {
 await   execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate`, 'terminal')

}

export const migrateFresh=async(systemName:string, projectName:string): Promise<void> => {
  await  execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate:fresh --seed`, 'terminal')

}