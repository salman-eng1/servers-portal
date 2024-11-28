"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployRoutes = void 0;
const enable_system_1 = require("../controllers/enable-system");
const express_1 = __importDefault(require("express"));
class DeployRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/get-systems', enable_system_1.getSystems);
        this.router.get('/get-system-projects', enable_system_1.getSystemProjects);
        return this.router;
    }
}
exports.deployRoutes = new DeployRoutes();
//# sourceMappingURL=enable-system.js.map