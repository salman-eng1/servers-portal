"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkRoutes = void 0;
const network_settings_1 = require("../controllers/network-settings");
const express_1 = __importDefault(require("express"));
class NetworkRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/change-netplan-ip', network_settings_1.changeNetworkSettings);
        return this.router;
    }
}
exports.networkRoutes = new NetworkRoutes();
//# sourceMappingURL=network-settings.js.map