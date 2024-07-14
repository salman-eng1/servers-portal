import { execute } from "@portal/services/non-streamed-command"

export const systemProjects=async(systemName:string): Promise<string[]> => {
const projects = await execute(`ls -l /var/www/${systemName} | grep '^d' | awk '{print $9}'`, 'terminal');
const projectsArray = projects.split('\n').filter(project => project.trim() !== '');
return projectsArray as string[];
    }