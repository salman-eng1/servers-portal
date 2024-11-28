import { Application, json, urlencoded } from 'express';
// import cookieSession from 'cookie-session';
// import hpp from 'hpp';
// import helmet from 'helmet';
import compression from 'compression';
import http from 'http';
// import { config } from '@portal/config';
import { appRoutes } from '@portal/routes';
import { ApiError } from "@portal/utils/api-error";
import { logger } from '@portal/utils/logging';
import { Server } from 'socket.io';
import cors from 'cors'

const SERVER_PORT = process.env.PORT || 5000;
export let socketIO: Server;

export class PortalServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        // this.errorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.set('trust proxy', 1);
        app.use(cors({ origin: '*' })); // Adjust the origin as needed

    }

    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '200mb' }));
        app.use(urlencoded({ extended: true, limit: '200mb' }));
    }

    private routesMiddleware(app: Application): void {
        appRoutes(app);
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
            this.createSocketIO(httpServer);
            logger.log({ level: 'info', message: 'server started successfully!' });
        } catch (error) {
            throw new ApiError('Error Starting Server, startServer() method', 100);
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io = new Server(httpServer, {
            cors: {
              origin: '*', // Adjust the origin as needed
              methods: ['GET', 'POST']
            }
          });        socketIO = io;

        io.on('connection', (socket) => {
            logger.log({ level: 'info', message: 'A client connected' });

            socket.on('disconnect', () => {
                logger.log({ level: 'info', message: 'A client disconnected' });
            });
        });

        return io;
    }

    private async startHttpServer(httpServer: http.Server): Promise<void> {
        try {
            httpServer.listen(SERVER_PORT, () => {
                logger.log({ level: 'info', message: 'Http server started successfully!' });
            });
        } catch (error) {
            throw new ApiError('Error Starting Http Server, startHttpServer() method', 100);
        }
    }
}
