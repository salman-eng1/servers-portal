import { socketIO } from '@portal/server'; // Adjust the import path as needed
const { exec } = require('child_process');

export const execute = async (command: string, socketChannel:string): Promise<void> => {
 await exec(command, (err: string, stdout: string) => {

        socketIO.emit(`${socketChannel}`, `${stdout}`);
        if(err){
          socketIO.emit(`${socketChannel}`, `${err}`);
        }
    
  });
}
