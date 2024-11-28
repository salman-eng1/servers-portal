"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ports = void 0;
const ports_1 = require("../controllers/ports");
const express_1 = __importDefault(require("express"));
class Ports {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        // this.router.get('/get-system-ports',getSystemPorts)
        this.router.post('/add-system-ports', ports_1.addSystemPorts);
        this.router.delete('/delete-system-ports', ports_1.deleteSystemPorts);
        return this.router;
    }
}
exports.ports = new Ports();
//# sourceMappingURL=ports.js.map