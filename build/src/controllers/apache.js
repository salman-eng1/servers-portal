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
exports.getEnabledProjects = exports.disableSys = exports.enableSys = void 0;
const apache_1 = require("../services/apache");
const non_streamed_command_1 = require("../services/non-streamed-command");
const logging_1 = require("../utils/logging");
const http_status_codes_1 = require("http-status-codes");
const enableSys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const systemName = req.body.systemName;
        const deleteAll = req.body.deleteAll;
        const enabledSystem = yield (0, apache_1.enableSystem)(systemName, deleteAll);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: enabledSystem });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to retrieve enable system`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to enable system' });
    }
});
exports.enableSys = enableSys;
const disableSys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const systemName = req.body.systemName;
        const deleteAll = req.body.deleteAll;
        const disabledSystem = yield (0, apache_1.disableSystem)(systemName, deleteAll);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: disabledSystem });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to disable system`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to disable system' });
    }
});
exports.disableSys = disableSys;
const getEnabledProjects = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield (0, non_streamed_command_1.execute)("ls -l /etc/apache2/sites-enabled | awk '{print $9}'", '');
        const enabledProjectsArray = projects.split('\n').filter(project => project.trim() !== '');
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: enabledProjectsArray });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to retrieve enabled projects`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve enabled projects' });
    }
});
exports.getEnabledProjects = getEnabledProjects;
//# sourceMappingURL=apache.js.map