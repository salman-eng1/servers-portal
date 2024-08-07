import { execute } from "@portal/services/non-streamed-command";
import { systemProjects } from "./sharedHelper";

export const getPorts = async (systemName: string): Promise<string[]> => {
    const systemsProjects: string[] = await systemProjects(systemName);
    
    // Use Promise.all to handle async calls in parallel
    const ports: string[] = await Promise.all(
      systemsProjects.map(async (project) => {
        const port: string = await execute(
          `grep -E '^APP_URL=' /var/www/${systemName}/${project}/.env | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
          ''
        );
        return port.trim() || '80'; // Trim newline and replace empty string with '80'
      })
    );
  
    return ports as string[];
  }
  
  export const deletePorts = async (systemName: string): Promise<string[]> => {
    const ports: string[] = await getPorts(systemName);
  
    // Use Promise.all to handle async deletion of port lines in parallel
    const deletedPorts: string[] = await Promise.all(
      ports.map(async (port) => {
        // Define the command to delete the line containing the port in the Apache configuration
        const deleteCommand = `sudo sed -i '/${port}/d' /etc/apache2/ports.conf`;
  
        // Execute the delete command
        await execute(deleteCommand, '');
  
        // Return the deleted port to confirm it was processed
        return port;
      })
    );
  
    return deletedPorts;
  }
  