import { execute } from "@portal/services/non-streamed-command"
import { basename } from 'path';


export const systemProjects = async (systemName: string): Promise<string[]> => {
  // Find all directories under /var/www/systemName
  const projects = await execute(
      `find /var/www/${systemName} -type d`, 
      ''
  );

  const rootDirPath = `/var/www/${systemName}`;

  const directories = projects
    .split('\n')
    .filter(project => project.trim() !== '')
    .filter(dir => dir !== rootDirPath);

  const hasSubdirectories = async (dir: string): Promise<boolean> => {
    const subdirs = await execute(`find ${dir} -mindepth 1 -maxdepth 1 -type d`, '');
    return subdirs.split('\n').filter(subdir => subdir.trim() !== '').length > 0;
  };

  const filteredDirectories = await Promise.all(
    directories.map(async dir => {
      const containsSubdirs = await hasSubdirectories(dir);
      return containsSubdirs ? null : basename(dir); // Return null for directories with subdirectories
    })
  );
  return filteredDirectories.filter(dir => dir !== null) as string[];
};



export const migrate=async(systemName:string, projectName:string): Promise<void> => {
 await   execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate`, 'terminal')

}

export const migrateFresh=async(systemName:string, projectName:string): Promise<void> => {
  await  execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate:fresh --seed`, 'terminal')

}