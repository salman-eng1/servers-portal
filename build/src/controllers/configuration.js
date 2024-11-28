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
exports.fixProjectPermissions = exports.fixProjectSymlinks = exports.clearProjectCache = exports.migrateProjetctDB = void 0;
const logging_1 = require("../utils/logging");
const http_status_codes_1 = require("http-status-codes");
const configuration_1 = require("../services/configuration");
const migrateProjetctDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const systemName = req.body.systemName;
    try {
        const response = yield (0, configuration_1.migrateFresh)(systemName);
        if (!response) {
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: `project with name ${systemName} is not available in your server` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: response });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to migrate ${systemName} database`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to migrate ${systemName} database` });
    }
});
exports.migrateProjetctDB = migrateProjetctDB;
const clearProjectCache = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const systemName = req.body.systemName;
    try {
        const response = yield (0, configuration_1.clearCache)(systemName);
        if (!response) {
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: `project with name ${systemName} is not available in your server` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: response });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to clear ${systemName} cache`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to clear ${systemName} cache` });
    }
});
exports.clearProjectCache = clearProjectCache;
const fixProjectSymlinks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, configuration_1.fixSymlinks)();
        if (!response) {
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: `symlinks are not fixed` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: response });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to fix symlinks`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to fix symlinks` });
    }
});
exports.fixProjectSymlinks = fixProjectSymlinks;
const fixProjectPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, configuration_1.fixPermissions)(req.body.systemName);
        if (!response) {
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: `permissions are not fixed` });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: response });
    }
    catch (err) {
        logging_1.logger.log('error', `Failed to fix permissions`);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: `Failed to fix permissions` });
    }
});
exports.fixProjectPermissions = fixProjectPermissions;
//# sourceMappingURL=configuration.js.map