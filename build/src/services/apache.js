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
exports.enableSystem = exports.disableSystem = void 0;
const sharedHelper_1 = require("../services/sharedHelper");
const non_streamed_command_1 = require("../services/non-streamed-command");
const ports_1 = require("../services/ports");
const fs_1 = require("fs");
const crontab_1 = require("../utils/env-files/crontab");
const create_file_1 = require("../services/create-file");
const disableSystem = (systemName, deleteAll) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield (0, sharedHelper_1.subSystemProjects)(systemName);
    const disabledProjects = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        if (deleteAll) {
            const disableCommand = `cd /etc/apache2/sites-enabled && rm *.conf`;
            const enableServerPortal = `cd /etc/apache2/sites-available && a2ensite server-portal.conf`;
            yield (0, non_streamed_command_1.execute)(disableCommand, 'terminal');
            yield (0, non_streamed_command_1.execute)(enableServerPortal, 'terminal');
        }
        else {
            const disableCommand = `cd /etc/apache2/sites-enabled && unlink ${project}.conf`;
            yield (0, non_streamed_command_1.execute)(disableCommand, 'terminal');
        }
        return project;
    })));
    if (deleteAll) {
        yield (0, ports_1.deletePorts)();
        const cronCreateData = yield (0, crontab_1.crontabCreate)();
        yield fs_1.promises.writeFile('/etc/crontab', cronCreateData, 'utf-8'); // Ensure this completes before appending
        yield (0, non_streamed_command_1.execute)('echo Listen 5500 >> /etc/apache2/ports.conf', 'terminal');
    }
    else {
        yield (0, ports_1.deleteProjectPorts)(systemName);
    }
    yield (0, non_streamed_command_1.execute)(`sudo sed -i '/${systemName}/d' /etc/crontab`, '');
    yield (0, non_streamed_command_1.execute)('systemctl restart apache2', '');
    return disabledProjects;
});
exports.disableSystem = disableSystem;
const enableSystem = (systemName, deleteAll) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.disableSystem)(systemName, deleteAll);
    const projects = yield (0, sharedHelper_1.subSystemProjects)(systemName);
    const enabledProjects = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        const enableCommand = `cd /etc/apache2/sites-available && a2ensite ${project}.conf`;
        yield (0, non_streamed_command_1.execute)(enableCommand, 'terminal');
        return project;
    })));
    yield (0, ports_1.addPorts)(systemName);
    // Create the crontab file with the necessary content
    const crondata = yield (0, crontab_1.crontab)(systemName);
    const cronCreateData = yield (0, crontab_1.crontabCreate)();
    if (deleteAll) {
        yield fs_1.promises.writeFile('/etc/crontab', cronCreateData, 'utf-8'); // Ensure this completes before appending
    }
    // Append additional crontab data
    yield (0, create_file_1.appendToFile)('/etc/crontab', crondata); // Await to ensure it completes properly
    yield (0, non_streamed_command_1.execute)('systemctl restart apache2', '');
    return enabledProjects;
});
exports.enableSystem = enableSystem;
//# sourceMappingURL=apache.js.map