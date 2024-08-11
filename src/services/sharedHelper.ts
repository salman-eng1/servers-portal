import { execute } from "@portal/services/non-streamed-command"
import { basename } from 'path';


export const systemProjects = async (systemName: string): Promise<string[]> => {
  const rootDirPath = `/var/www/${systemName}`;

  // Find all directories up to two levels deep under /var/www/systemName
  const projects = await execute(
    `find ${rootDirPath} -mindepth 1 -maxdepth 2 -type d`, 
    ''
  );

  const directories = projects
    .split('\n')
    .filter(dir => dir.trim() !== '');

  // Set to store directories that should be excluded (those that have subdirectories)
  const parentDirs = new Set<string>();

  for (const dir of directories) {
    const subdirs = directories.filter(d => d.startsWith(`${dir}/`));
    if (subdirs.length > 0) {
      parentDirs.add(dir);
    }
  }

  const filteredDirectories = directories
    .filter(dir => !parentDirs.has(dir))
    .map(dir => basename(dir));

  return filteredDirectories;
};



export const migrate=async(systemName:string, projectName:string): Promise<void> => {
 await   execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate`, 'terminal')

}

export const migrateFresh=async(systemName:string, projectName:string): Promise<void> => {
  await  execute(`cd /var/www/${systemName}/${projectName} && php artisan migrate:fresh --seed`, 'terminal')

}