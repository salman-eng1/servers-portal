// export const updateNetplanIP = async (interfaceName: string, newIP: string, newMask: string): Promise<void> => {
//     try {
//       const netplanFilePath = '/etc/netplan/01-netcfg.yaml'; // Adjust if necessary
//       const netplanBackupFilePath = '/etc/netplan/01-netcfg.yaml.bak';
  
//       // Read the existing netplan configuration
//       const netplanConfig = await readFilePromise(netplanFilePath, 'utf8');
//       const netplanData: NetplanConfig = YAML.parse(netplanConfig);
  
//       // Backup the existing netplan configuration
//       await writeFilePromise(netplanBackupFilePath, netplanConfig);
  
//       // Update the IP and mask for the specified interface
//       if (!netplanData.network.ethernets[interfaceName]) {
//         throw new Error(`Interface ${interfaceName} not found in netplan configuration`);
//       }
//       netplanData.network.ethernets[interfaceName].dhcp4 = false;
//       netplanData.network.ethernets[interfaceName].addresses = [`${newIP}/${newMask}`];
  
//       // Write the modified configuration back to the file
//       const updatedNetplanConfig = YAML.stringify(netplanData);
//       await writeFilePromise(netplanFilePath, updatedNetplanConfig);
  
//       // Apply the changes
//       await execPromise('netplan apply');
//     } catch (error) {
//       console.error(`Failed to update netplan configuration: ${error.message}`);
//       throw error;
//     }
//   };
  