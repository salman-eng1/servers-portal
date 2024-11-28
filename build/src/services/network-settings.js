"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNetplanIP = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const yaml_1 = __importDefault(require("yaml"));
const non_streamed_command_1 = require("./non-streamed-command");
// Promisify the readFile, writeFile, and exec functions
const readFilePromise = (0, util_1.promisify)(fs_1.readFile);
const writeFilePromise = (0, util_1.promisify)(fs_1.writeFile);
const updateNetplanIP = (newIP, newMask, dns, gateway) => __awaiter(void 0, void 0, void 0, function* () {
    const netplanFilePath = '/etc/netplan/00-installer-config.yaml'; // Adjust if necessary
    const netplanBackupFilePath = '/etc/netplan/00-installer-config.yaml.bak';
    // Read the existing netplan configuration
    const netplanConfig = yield readFilePromise(netplanFilePath, 'utf8');
    const netplanData = yaml_1.default.parse(netplanConfig);
    const currentIP = yield (0, non_streamed_command_1.execute)("ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1", 'terminal'); // Backup the existing netplan configuration
    yield writeFilePromise(netplanBackupFilePath, netplanConfig);
    // Update the IP and mask for the specified interface
    netplanData.network.ethernets.eth0.dhcp4 = false;
    netplanData.network.ethernets.eth0.addresses = [`${newIP}/${newMask}`];
    // Ensure dns is treated as an array
    if (typeof dns === 'string') {
        netplanData.network.ethernets.eth0.nameservers.addresses = dns.split(',').map(ip => ip.trim());
    }
    else {
        netplanData.network.ethernets.eth0.nameservers.addresses = dns;
    }
    netplanData.network.ethernets.eth0.gateway4 = `${gateway}`;
    // Write the modified configuration back to the file
    const updatedNetplanConfig = yaml_1.default.stringify(netplanData);
    yield writeFilePromise(netplanFilePath, updatedNetplanConfig);
    console.log(newIP);
    console.log(currentIP);
    yield (0, non_streamed_command_1.execute)(`bash /home/zeuor/scripts/changeEnvIP.sh "${currentIP.trim()}" "${newIP}" /var/www`, 'terminal'); // await execute(`bash /home/zeuor/scripts/changeEnvIP.sh ${currentIP} ${newIP} /home/zeuor/cron*`,'terminal')
    // Apply the changes
    yield (0, non_streamed_command_1.execute)('netplan apply', '');
});
exports.updateNetplanIP = updateNetplanIP;
//# sourceMappingURL=network-settings.js.map