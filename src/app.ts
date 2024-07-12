import express, { Express } from "express"
import { PortalServer } from "@portal/server";

class Application{
public initialize(): void{
const app:Express = express();
const server: PortalServer=new PortalServer(app);
server.start();
}
}

const application: Application = new Application();


application.initialize();

