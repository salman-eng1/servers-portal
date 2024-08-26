import { execute } from "@portal/services/non-streamed-command"
import { basename } from 'path';

export const subSystemProjects = async (systemName: string): Promise<string[]> => {
  try {
    const rootDirPath = `/var/www/${systemName}`;

    // Find all directories within the root directory (non-recursive)
    const projects = await execute(`find ${rootDirPath} -mindepth 1 -maxdepth 1 -type d`, '');

    const directories = projects
      .split('\n')
      .filter(project => project.trim() !== '');

    // Return the base names of the directories
    return directories.map(dir => basename(dir));
  } catch (error) {
    console.error(`Error fetching projects for ${systemName}:`, error);
    return [];
  }
};

export const systemProjects = async (systemName: string): Promise<string[]> => {
  try {
    const rootDirPath = `/var/www/${systemName}`;
    
    // Find all directories under /var/www/systemName
    const projects = await execute(`find ${rootDirPath} -type d`, '');

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
  } catch (error) {
    console.error(`Error fetching projects for ${systemName}:`, error);
    return [];
  }
};

export const migrate=async(systemName:string, projectName:string): Promise<void> => {
 await   execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate`, 'terminal')

}

export const migrateFresh=async(systemName:string, projectName:string): Promise<void> => {
  await  execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate:fresh --seed`, 'terminal')

}