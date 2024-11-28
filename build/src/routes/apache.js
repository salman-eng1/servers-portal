"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apache = void 0;
const apache_1 = require("../controllers/apache");
const express_1 = __importDefault(require("express"));
class Apache {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/enable-system', apache_1.enableSys);
        this.router.post('/disable-system', apache_1.disableSys);
        this.router.get('/get-enabled-projects', apache_1.getEnabledProjects);
        return this.router;
    }
}
exports.apache = new Apache();
//# sourceMappingURL=apache.js.map