import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import YAML from 'yaml';
import { execute } from './non-streamed-command';



// Promisify the readFile, writeFile, and exec functions
const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

// Define the NetplanConfig type based on the structure of your netplan YAML configuration
interface NetplanConfig {
  network: {
    ethernets: {
      eth0: {
        dhcp4: boolean;
        addresses: string[];
        gateway4: string;
        nameservers: {
          addresses: string[];
        };
      };
    };
    version: number;
  };
}

export const updateNetplanIP = async (newIP: string, newMask: string,dns:string,gateway:string): Promise<void> => {
    const netplanFilePath = '/etc/netplan/00-installer-config.yaml'; // Adjust if necessary
    const netplanBackupFilePath = '/etc/netplan/00-installer-config.yaml.bak';

    // Read the existing netplan configuration
    const netplanConfig = await readFilePromise(netplanFilePath, 'utf8');
    const netplanData: NetplanConfig = YAML.parse(netplanConfig);

    const currentIP = await execute("ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1", 'terminal');    // Backup the existing netplan configuration
    await writeFilePromise(netplanBackupFilePath, netplanConfig);

    // Update the IP and mask for the specified interface

    netplanData.network.ethernets.eth0.dhcp4 = false;
    netplanData.network.ethernets.eth0.addresses = [`${newIP}/${newMask}`];
// Ensure dns is treated as an array
if (typeof dns === 'string') {
  netplanData.network.ethernets.eth0.nameservers.addresses = dns.split(',').map(ip => ip.trim());
} else {
  netplanData.network.ethernets.eth0.nameservers.addresses = dns;
}
  netplanData.network.ethernets.eth0.gateway4 = `${gateway}`;



    // Write the modified configuration back to the file
    const updatedNetplanConfig = YAML.stringify(netplanData);
    await writeFilePromise(netplanFilePath, updatedNetplanConfig);
    console.log(newIP)
    console.log(currentIP)

    await execute(`bash /home/zeuor/scripts/changeEnvIP.sh "${currentIP.trim()}" "${newIP}" /var/www`, 'terminal');    // await execute(`bash /home/zeuor/scripts/changeEnvIP.sh ${currentIP} ${newIP} /home/zeuor/cron*`,'terminal')

    // Apply the changes
    await execute('netplan apply','');

 
};



