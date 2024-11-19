import { execute } from "@portal/services/non-streamed-command"


export const migrateFresh = async (systemName: string): Promise<string> => {

    await execute(`bash /home/zeuor/scripts/migrate.sh ${systemName}`, 'terminal');
    return `${systemName} database has been migrated` as string;
  
};


export const clearCache = async (systemName: string): Promise<string> => {

  await execute(`bash /home/zeuor/scripts/clearcache.sh ${systemName}`, 'terminal');
  return `${systemName} cache has been cleared` as string;

};


export const fixSymlinks = async (): Promise<string> => {

  await execute(`bash /home/zeuor/scripts/symlinks.sh`, 'terminal');
  return `All symlinks have been fixed correctly` as string;

};