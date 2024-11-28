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
exports.deleteSystemPorts = exports.addSystemPorts = exports.getSystemPorts = void 0;
const ports_1 = require("../services/ports");
const logging_1 = require("../utils/logging");
const http_status_codes_1 = require("http-status-codes");
const getSystemPorts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ports = yield (0, ports_1.getPorts)(_req.body.systemName);
        console.log(ports);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: ports });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to retrieve enabled projects`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve ports' });
    }
});
exports.getSystemPorts = getSystemPorts;
const addSystemPorts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ports = yield (0, ports_1.addPorts)(_req.body.systemName);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: ports });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to add projects ports`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to add ports' });
    }
});
exports.addSystemPorts = addSystemPorts;
const deleteSystemPorts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPorts = yield (0, ports_1.deletePorts)();
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: deletedPorts });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to disable projects projects ports`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to disable ports' });
    }
});
exports.deleteSystemPorts = deleteSystemPorts;
//# sourceMappingURL=ports.js.map