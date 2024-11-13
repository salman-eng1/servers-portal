import { execute } from "@portal/services/non-streamed-command";

export const getPorts = async (systemName: string): Promise<string[]> => {
  const systemPath = `/var/www/${systemName}`;
  const envFilesString: string = await execute(
    `find ${systemPath} -type f -name '.env'`, 
    ''
  );
  const envFiles: string[] = envFilesString.split('\n').filter(Boolean); // Filter out empty strings
  const ports: string[] = await Promise.all(
    envFiles.map(async (envFile) => {
      const port: string = await execute(
        `grep -E '^APP_URL=' ${envFile} | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
        ''
      );
      return port.trim() || '80'; // Trim newline and replace empty string with '80'
    })
  );

  return ports as string[];
}

  export const deletePorts = async (): Promise<string> => {


        const deleteCommand = `sudo sed -i '/^Listen/d' /etc/apache2/ports.conf`;
          await execute(deleteCommand, '');

    return 'ports deleted successfully';
  }
  
  export const addPorts = async (systemName: string): Promise<string[]> => {
    const ports: string[] = await getPorts(systemName);
    await deletePorts();
  
    const addedPorts: string[] = await Promise.all(
      ports.map(async (port) => {
        const addCommand = `echo 'Listen ${port}' >> /etc/apache2/ports.conf`;
          await execute(addCommand, '');
          return port;
      })
    );
    return addedPorts;
  }