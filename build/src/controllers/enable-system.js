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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProject = exports.getSystemProjects = exports.getSystems = void 0;
const create_file_1 = require("../services/create-file");
const non_streamed_command_1 = require("../services/non-streamed-command");
const sharedHelper_1 = require("../services/sharedHelper");
const logging_1 = require("../utils/logging");
const http_status_codes_1 = require("http-status-codes");
const getSystems = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield (0, non_streamed_command_1.execute)("ls -l /var/www | grep '^d' | awk '{print $9}'", '');
        const projectsArrayTemp = projects.split('\n').filter(project => project.trim() !== '');
        const projectsArray = [];
        projectsArrayTemp.forEach(project => {
            if (project != 'server-portal') {
                projectsArray.push(project);
            }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: projectsArray });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to retrieve projects`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve projects' });
    }
});
exports.getSystems = getSystems;
const getSystemProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const systemName = req.body.systemName;
        const projectsArray = yield (0, sharedHelper_1.subSystemProjects)(systemName);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: projectsArray });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to retrieve sub projects`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve sub projects' });
    }
});
exports.getSystemProjects = getSystemProjects;
const setupProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const systemName = req.body.systemName;
    const projects = req.body.projects;
    let unavailableProjects = [];
    try {
        const currentIP = (yield (0, non_streamed_command_1.execute)("ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1", 'terminal')).trim();
        console.log(currentIP, currentIP);
        yield (0, non_streamed_command_1.execute)(`sed -i '/^Listen/d' /etc/apache2/ports.conf`, 'terminal');
        yield (0, non_streamed_command_1.execute)(`cd /etc/apache2/sites-available && a2dissite *`, 'terminal');
        yield (0, non_streamed_command_1.execute)(`rm /etc/apache2/sites-available/*`, 'terminal');
        yield (0, non_streamed_command_1.execute)(`composer config --global --auth http-basic.zeour.repo.repman.io token 882348531a5bbe88761dbb26c1d1ffa9a8c4ff518e4f3111e4b160f26f6927ed`, 'terminal');
        const availableProjects = yield (0, sharedHelper_1.systemProjects)(systemName);
        let configContent = ``;
        let filePath = ``;
        for (const element of projects) {
            if (!availableProjects.includes(element.projectName)) {
                unavailableProjects.push(element.projectName);
            }
            else {
                // Update project
                if (element.update) {
                    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${element.projectName} && git pull ${element.gitlabUrl}`, 'terminal');
                }
                if (element.composerInstall) {
                    // Install composer
                    yield (0, non_streamed_command_1.execute)(`rm -r /var/www/${systemName}/${element.projectName}/vendor`, 'terminal');
                    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${element.projectName} && composer install`, 'terminal');
                    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${element.projectName} && composer dump-autoload`, 'terminal');
                }
                if (element.composerUpdate) {
                    // Update composer
                    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${element.projectName} && composer update`, 'terminal');
                }
                if (element.migrateFresh) {
                    // Fresh migrate project
                    yield (0, sharedHelper_1.migrateFresh)(systemName, element.projectName);
                }
                if (element.migrate) {
                    // Migrate project
                    yield (0, sharedHelper_1.migrate)(systemName, element.projectName);
                }
                yield (0, non_streamed_command_1.execute)(`echo Listen ${element.port} >> /etc/apache2/ports.conf`, 'terminal');
                yield (0, non_streamed_command_1.execute)(`sed -i "s|^APP_URL=http://.*|APP_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/${element.projectName}/.env"`, 'terminal');
                if (req.body.systemName === 'QMS') {
                    if (element.projectName === 'msa') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^MSA_URL=http://.*|MSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^APP_URL=http://.*|APP_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/${element.projectName}/.env"`, 'terminal');
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/cron*.sh"`, 'terminal');
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/reset.sh"`, 'terminal');
                    }
                    else if (element.projectName === 'ems') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^EMS_URL=http://.*|EMS_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|http://[^/]*|http://${currentIP}:${element.port}|" "/home/zeuor/${systemName}/cronincb.sh"`, 'terminal');
                    }
                    else if (element.projectName === 'csa') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^CSA_URL=http://.*|CSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                    }
                    else if (element.projectName === 'display') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^DSA_URL=http://.*|DSA_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                    }
                    else if (element.projectName === 'keypad') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^keypad_URL=http://.*|keypad_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                    }
                    else if (element.projectName === 'MobileWCSA') {
                        yield (0, non_streamed_command_1.execute)(`sed -i "s|^MOBILE_URL=http://.*|MOBILE_URL=http://${currentIP}:${element.port}|" "/var/www/${systemName}/*/.env"`, 'terminal');
                    }
                }
                yield (0, non_streamed_command_1.execute)(`bash /home/zeour/scripts/permission.sh /var/www/${systemName}/${element.projectName}`, 'terminal');
                configContent = `
    <VirtualHost *:${element.port}>
        DocumentRoot /var/www/${systemName}/${element.projectName}/public
        <Directory /var/www/${systemName}/${element.projectName}>
            AllowOverride All
            Order allow,deny
            allow from all
        </Directory>
        ErrorLog \${APACHE_LOG_DIR}/${element.projectName}_error.log
        CustomLog \${APACHE_LOG_DIR}/${element.projectName}_access.log combined
    </VirtualHost>
    `;
                filePath = `/etc/apache2/sites-available/${element.projectName}.conf`;
                (0, create_file_1.createFile)(configContent, filePath, 0o644);
            }
        }
        if (unavailableProjects.length === 0) {
            yield (0, non_streamed_command_1.execute)(`cd /etc/apache2/sites-available && a2ensite *`, 'terminal');
            yield (0, non_streamed_command_1.execute)(`systemctl reload apache2`, 'terminal');
            res.set('Cache-Control', 'public, max-age=300'); // 1 hour TTL
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Setup successful. All projects are available.' });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: `Please add projects [${unavailableProjects}] to /var/www` });
        }
    }
    catch (err) {
        logging_1.logger.log('error', 'Error in setupProject()', `${err}`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing request.' });
    }
});
exports.setupProject = setupProject;
//# sourceMappingURL=enable-system.js.map