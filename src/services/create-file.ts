import * as fs from 'fs';


export const createFile=async (configContent:any,filePath: string): Promise<void> => {
    fs.writeFileSync(filePath, configContent.trim());
    console.log(`Configuration file '${filePath}' successfully created.`);
}