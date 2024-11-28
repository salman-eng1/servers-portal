import {writeFileSync} from 'fs';
import { readFile, writeFile } from 'fs/promises';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    writeFileSync(filePath, configContent.trim(),{mode});
}



export const appendToFile = async (
  filePath: string,
  content: string,
  lineNumber: number
): Promise<void> => {
  try {
    // Step 1: Read the existing file content
    const fileContent = await readFile(filePath, { encoding: 'utf8' });

    // Debugging: log file content
    console.log('Original File Content:', fileContent);

    // Step 2: Split the content into lines
    const lines = fileContent.split('\n');

    // Debugging: log the lines array
    console.log('Lines Array:', lines);

    // Step 3: Insert the new content starting at the specified line number
    // Adjust for zero-based index (line 10 is index 9)
    if (lineNumber <= lines.length) {
      lines.splice(lineNumber - 1, 0, content.trim());
    } else {
      // If line number exceeds the existing lines, just append to the end
      lines.push(content.trim());
    }

    // Debugging: log the updated lines array
    console.log('Updated Lines Array:', lines);

    // Step 4: Join the lines back together
    const updatedContent = lines.join('\n');

    // Step 5: Write the updated content back to the file
    await writeFile(filePath, updatedContent, { encoding: 'utf8' });

    console.log(`Content successfully inserted at line ${lineNumber}`);
  } catch (error) {
    console.error(`Error appending to file ${filePath}:`, error);
  }
};

// Example usage: Append 'im salman' starting from line 10
appendToFile('yourfile.txt', 'im salman', 10);
