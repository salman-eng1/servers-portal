import {writeFileSync} from 'fs';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    writeFileSync(filePath, configContent.trim(),{mode});
}



import { readFile, writeFile, appendFile } from 'fs/promises';

export const appendToFile = async (newCronData: string,crontabPath:string): Promise<void> => {

  try {
    // Step 1: Read the existing crontab content
    const existingCrontab = await readFile(crontabPath, { encoding: 'utf8' });

    // Step 2: Clear the crontab file (overwrite with empty content)
    await writeFile(crontabPath, '', { encoding: 'utf8' });

    // Step 3: Append the new cron data
    await appendFile(crontabPath, `${newCronData.trim()}\n`, { encoding: 'utf8' });

    // Step 4: Append the previously read crontab content back at the end
    await appendFile(crontabPath, `${existingCrontab.trim()}\n`, { encoding: 'utf8' });

    console.log('Crontab has been updated successfully');
  } catch (error) {
    console.error('Error updating crontab:', error);
  }
};



