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
exports.migrateFresh = exports.migrate = exports.systemProjects = exports.subSystemProjects = void 0;
const non_streamed_command_1 = require("../services/non-streamed-command");
const path_1 = require("path");
const subSystemProjects = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rootDirPath = `/var/www/${systemName}`;
        // Find all directories within the root directory (non-recursive)
        const projects = yield (0, non_streamed_command_1.execute)(`find ${rootDirPath} -mindepth 1 -maxdepth 1 -type d`, '');
        const directories = projects
            .split('\n')
            .filter(project => project.trim() !== '');
        // Return the base names of the directories
        return directories.map(dir => (0, path_1.basename)(dir));
    }
    catch (error) {
        console.error(`Error fetching projects for ${systemName}:`, error);
        return [];
    }
});
exports.subSystemProjects = subSystemProjects;
const systemProjects = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rootDirPath = `/var/www/${systemName}`;
        // Find all directories under /var/www/systemName
        const projects = yield (0, non_streamed_command_1.execute)(`find ${rootDirPath} -type d`, '');
        const directories = projects
            .split('\n')
            .filter(project => project.trim() !== '')
            .filter(dir => dir !== rootDirPath);
        const hasSubdirectories = (dir) => __awaiter(void 0, void 0, void 0, function* () {
            const subdirs = yield (0, non_streamed_command_1.execute)(`find ${dir} -mindepth 1 -maxdepth 1 -type d`, '');
            return subdirs.split('\n').filter(subdir => subdir.trim() !== '').length > 0;
        });
        const filteredDirectories = yield Promise.all(directories.map((dir) => __awaiter(void 0, void 0, void 0, function* () {
            const containsSubdirs = yield hasSubdirectories(dir);
            return containsSubdirs ? null : (0, path_1.basename)(dir); // Return null for directories with subdirectories
        })));
        return filteredDirectories.filter(dir => dir !== null);
    }
    catch (error) {
        console.error(`Error fetching projects for ${systemName}:`, error);
        return [];
    }
});
exports.systemProjects = systemProjects;
const migrate = (systemName, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${projectName} && php artisan migrate`, 'terminal');
});
exports.migrate = migrate;
const migrateFresh = (systemName, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, non_streamed_command_1.execute)(`cd /var/www/${systemName}/${projectName} && php artisan migrate:fresh --seed`, 'terminal');
});
exports.migrateFresh = migrateFresh;
//# sourceMappingURL=sharedHelper.js.map