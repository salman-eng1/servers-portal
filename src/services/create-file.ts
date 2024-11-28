import {appendFile} from 'fs/promises';
import {writeFileSync} from 'fs';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    writeFileSync(filePath, configContent.trim(),{mode});
}


import { promises as fs } from 'fs';

// Function to append data to the latest line of the file
export async function appendToFile(filePath: string, data: string): Promise<void> {
    try {
        // Read the current content of the file
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Check if the file ends with a newline character
        const newData = fileContent.endsWith('\n') ? data : `\n${data}`;

        // Append the data to the file
        await fs.appendFile(filePath, newData, 'utf-8');
        console.log('Data successfully appended to the latest line of the file');
    } catch (error) {
        console.error('Error appending to file:', error);
    }
}


