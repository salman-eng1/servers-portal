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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalServer = exports.socketIO = void 0;
const express_1 = require("express");
// import cookieSession from 'cookie-session';
// import hpp from 'hpp';
// import helmet from 'helmet';
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
// import { config } from './config';
const routes_1 = require("./routes");
const api_error_1 = require("./utils/api-error");
const logging_1 = require("./utils/logging");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const SERVER_PORT = process.env.PORT || 5000;
class PortalServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        // this.errorHandler(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.set('trust proxy', 1);
        app.use((0, cors_1.default)({ origin: '*' })); // Adjust the origin as needed
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '200mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '200mb' }));
    }
    routesMiddleware(app) {
        (0, routes_1.appRoutes)(app);
    }
    startServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const httpServer = new http_1.default.Server(app);
                this.startHttpServer(httpServer);
                this.createSocketIO(httpServer);
                logging_1.logger.log({ level: 'info', message: 'server started successfully!' });
            }
            catch (error) {
                throw new api_error_1.ApiError('Error Starting Server, startServer() method', 100);
            }
        });
    }
    createSocketIO(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*', // Adjust the origin as needed
                    methods: ['GET', 'POST']
                }
            });
            exports.socketIO = io;
            io.on('connection', (socket) => {
                logging_1.logger.log({ level: 'info', message: 'A client connected' });
                socket.on('disconnect', () => {
                    logging_1.logger.log({ level: 'info', message: 'A client disconnected' });
                });
            });
            return io;
        });
    }
    startHttpServer(httpServer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                httpServer.listen(SERVER_PORT, () => {
                    logging_1.logger.log({ level: 'info', message: 'Http server started successfully!' });
                });
            }
            catch (error) {
                throw new api_error_1.ApiError('Error Starting Http Server, startHttpServer() method', 100);
            }
        });
    }
}
exports.PortalServer = PortalServer;
//# sourceMappingURL=server.js.map