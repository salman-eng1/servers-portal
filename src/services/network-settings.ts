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
        gateway: string;
        nameservers: {
          addresses: string[]; // Dynamic array of nameserver addresses
        };
      };
    };
    version: number;
  };
}


export const updateNetplanIP = async (newIP: string, newMask: string,dns:string[]): Promise<void> => {
    const netplanFilePath = '/etc/netplan/00-installer-config.yaml'; // Adjust if necessary
    const netplanBackupFilePath = '/etc/netplan/00-installer-config.yaml.bak';

    // Read the existing netplan configuration
    const netplanConfig = await readFilePromise(netplanFilePath, 'utf8');
    const netplanData: NetplanConfig = YAML.parse(netplanConfig);

    const currentIP = execute("'ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1' ", 'terminal')
    // Backup the existing netplan configuration
    await writeFilePromise(netplanBackupFilePath, netplanConfig);

    // Update the IP and mask for the specified interface

    netplanData.network.ethernets.eth0.dhcp4 = false;
    netplanData.network.ethernets.eth0.addresses = [`${newIP}/${newMask}`];
    netplanData.network.ethernets.eth0.nameservers.addresses = dns;



    // Write the modified configuration back to the file
    const updatedNetplanConfig = YAML.stringify(netplanData);
    await writeFilePromise(netplanFilePath, updatedNetplanConfig);
    await execute(`bash /home/zeuor/scripts/changeEnvIP.sh ${currentIP} ${newIP} /var/www`, 'terminal')
    await execute(`bash /home/zeuor/scripts/changeEnvIP.sh ${currentIP} ${newIP} /home/zeuor`,'terminal')

    console.log(`${currentIP} ${newIP}`)
    // Apply the changes
    // await execPromise('netplan apply');
 
};




