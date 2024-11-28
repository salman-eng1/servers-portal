"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const configuration_1 = require("../controllers/configuration");
const express_1 = __importDefault(require("express"));
class Config {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/migrate-fresh', configuration_1.migrateProjetctDB);
        this.router.post('/clear-cache', configuration_1.clearProjectCache);
        this.router.post('/fix-symlinks', configuration_1.fixProjectSymlinks);
        this.router.post('/fix-permissions', configuration_1.fixProjectPermissions);
        return this.router;
    }
}
exports.config = new Config();
//# sourceMappingURL=configuration.js.map