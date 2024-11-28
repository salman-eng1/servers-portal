import {appendFile} from 'fs/promises';
import {writeFileSync} from 'fs';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    writeFileSync(filePath, configContent.trim(),{mode});
}



import { readFile, writeFile } from 'fs/promises';

export const appendToFile = async (
  filePath: string,
  content: string,
  lineNumber: number
): Promise<void> => {
  try {
    // Step 1: Read the existing file content
    const fileContent = await readFile(filePath, { encoding: 'utf8' });

    // Step 2: Split the content into lines
    const lines = fileContent.split('\n');

    // Step 3: Insert the new content starting at the specified line number
    // Adjust for zero-based index (line 10 is index 9)
    lines.splice(lineNumber - 1, 0, content.trim());

    // Step 4: Join the lines back together
    const updatedContent = lines.join('\n');

    // Step 5: Write the updated content back to the file
    await writeFile(filePath, updatedContent, { encoding: 'utf8' });

    console.log(`Content successfully inserted at line ${lineNumber}`);
  } catch (error) {
    console.error(`Error appending to file ${filePath}:`, error);
  }
};



