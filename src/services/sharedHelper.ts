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




// export const getPorts = async (systemName: string): Promise<string[]> => {
//   const systemsProjects: string[] = await systemProjects(systemName);
  
//   // Use Promise.all to handle async calls in parallel
//   const ports: string[] = await Promise.all(
//     systemsProjects.map(async (project) => {
//       const port: string = await execute(
//         `grep -E '^APP_URL=' /var/www/${systemName}/${project}/.env | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
//         ''
//       );
//       return port;
//     })
//   );

//   return ports;
// }

export const getPorts = async (systemName: string): Promise<string[]> => {
  const systemsProjects: string[] = await systemProjects(systemName);
  
  // Use Promise.all to handle async calls in parallel
  const ports: string[] = await Promise.all(
    systemsProjects.map(async (project) => {
      const port: string = await execute(
        `grep -E '^APP_URL=' /var/www/${systemName}/${project}/.env | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
        ''
      );
      return port.trim() || '80'; // Trim newline and replace empty string with '80'
    })
  );

  return ports;
}

  