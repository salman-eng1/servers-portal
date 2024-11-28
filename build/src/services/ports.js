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
exports.addPorts = exports.deleteProjectPorts = exports.deletePorts = exports.getPorts = void 0;
const non_streamed_command_1 = require("../services/non-streamed-command");
const getPorts = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    const systemPath = `/var/www/${systemName}`;
    const envFilesString = yield (0, non_streamed_command_1.execute)(`find ${systemPath} -type f -name '.env'`, '');
    const envFiles = envFilesString.split('\n').filter(Boolean); // Filter out empty strings
    const ports = yield Promise.all(envFiles.map((envFile) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if the envFile path matches the specific condition
        if (envFile === '/var/www/QMS/ems/.env') {
            return '80';
        }
        const port = yield (0, non_streamed_command_1.execute)(`grep -E '^APP_URL=' ${envFile} | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, '');
        return port.trim();
    })));
    return ports;
});
exports.getPorts = getPorts;
const deletePorts = () => __awaiter(void 0, void 0, void 0, function* () {
    const deleteCommand = `sudo sed -i '/^Listen/d' /etc/apache2/ports.conf`;
    yield (0, non_streamed_command_1.execute)(deleteCommand, '');
    return 'ports deleted successfully';
});
exports.deletePorts = deletePorts;
const deleteProjectPorts = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    const ports = yield (0, exports.getPorts)(systemName);
    ports.map((port) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteCommand = `sudo sed -i '/^Listen ${port}/d' /etc/apache2/ports.conf`;
        yield (0, non_streamed_command_1.execute)(deleteCommand, '');
    }));
    return 'ports deleted successfully';
});
exports.deleteProjectPorts = deleteProjectPorts;
const addPorts = (systemName) => __awaiter(void 0, void 0, void 0, function* () {
    const ports = yield (0, exports.getPorts)(systemName);
    const addedPorts = yield Promise.all(ports.map((port) => __awaiter(void 0, void 0, void 0, function* () {
        const addCommand = `echo 'Listen ${port}' >> /etc/apache2/ports.conf && sed -i '/^Listen[^0-9]*$/d' /etc/apache2/ports.conf        `;
        yield (0, non_streamed_command_1.execute)(addCommand, '');
        return port;
    })));
    return addedPorts;
});
exports.addPorts = addPorts;
//# sourceMappingURL=ports.js.map