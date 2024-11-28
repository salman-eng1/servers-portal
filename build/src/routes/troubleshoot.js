"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.troubleshootRoutes = void 0;
const troubleshoot_1 = require("../controllers/troubleshoot");
const express_1 = __importDefault(require("express"));
class TroubleshootRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/check-services', troubleshoot_1.checkServices);
        this.router.get('/check-ports', troubleshoot_1.checkPorts);
        return this.router;
    }
}
exports.troubleshootRoutes = new TroubleshootRoutes();
//# sourceMappingURL=troubleshoot.js.map