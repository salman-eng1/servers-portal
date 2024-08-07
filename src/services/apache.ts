import { systemProjects } from "@portal/services/sharedHelper";
import { execute } from "./non-streamed-command";

export const enableSystem = async (systemName: string): Promise<string[]> => {
    const projects: string[] = await systemProjects(systemName);
  
    const disabledProjects: string[] = await Promise.all(
      projects.map(async (project) => {
        const disableCommand = `cd /etc/apache2/sites-available && a2dissite ${project}.conf`;
          await execute(disableCommand, '');
          return project;
      })
    );
    return disabledProjects;
  }