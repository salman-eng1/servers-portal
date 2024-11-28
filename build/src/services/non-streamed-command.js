"use strict";
// import { socketIO } from '../server'; // Adjust the import path as needed
// const { exec } = require('child_process');
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
// export const execute = async (command: string, socketChannel:string): Promise<void> => {
//  await exec(command, (err: string, stdout: string) => {
//         socketIO.emit(`${socketChannel}`, `${stdout}`);
//         if(err){
//           socketIO.emit(`${socketChannel}`, `${err}`);
//         }
//   });
// }
const server_1 = require("../server"); // Adjust the import path as needed
const { exec } = require('child_process');
const execute = (command, socketChannel) => {
    return new Promise((resolve) => {
        exec(command, (err, stdout) => {
            server_1.socketIO.emit(`${socketChannel}`, `${stdout}`);
            if (err) {
                server_1.socketIO.emit(`${socketChannel}`, `${err}`);
            }
            resolve(stdout);
        });
    });
};
exports.execute = execute;
//# sourceMappingURL=non-streamed-command.js.map