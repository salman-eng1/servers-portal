import * as fs from 'fs';


export const createFile=async (configContent:any,filePath: string,mode:number): Promise<void> => {
    fs.writeFileSync(filePath, configContent.trim(),{mode});
}