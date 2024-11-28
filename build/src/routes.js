"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const health_1 = require("./routes/health");
const troubleshoot_1 = require("./routes/troubleshoot");
const enable_system_1 = require("./routes/enable-system");
const network_settings_1 = require("./routes/network-settings");
const apache_1 = require("./routes/apache");
const ports_1 = require("./routes/ports");
const configuration_1 = require("./routes/configuration");
const appRoutes = (app) => {
    app.use('', health_1.healthRoutes.routes());
    app.use('/api', troubleshoot_1.troubleshootRoutes.routes());
    app.use('/api', enable_system_1.deployRoutes.routes());
    app.use('/api', network_settings_1.networkRoutes.routes());
    app.use('/api', ports_1.ports.routes());
    app.use('/api', apache_1.apache.routes());
    app.use('/api', configuration_1.config.routes());
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
    // app.use(BASE_PATH, authRoutes.routes());
    // app.use(BASE_PATH, authRoutes.routes());
};
exports.appRoutes = appRoutes;
//# sourceMappingURL=routes.js.map