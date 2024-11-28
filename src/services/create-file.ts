import {appendFile} from 'fs/promises';
import {writeFileSync} from 'fs';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    writeFileSync(filePath, configContent.trim(),{mode});
}



export const appendToFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  try {
    // Append content to the file with proper options
    await appendFile(filePath, `\n${content.trim()}`, { encoding: 'utf8' });
    console.log(`Content successfully appended to ${filePath}`);
  } catch (error) {
    console.error(`Error appending to file ${filePath}:`, error);
  }
};

