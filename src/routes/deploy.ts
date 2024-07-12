import { getApacheProjects, getEnabledProjects,setupProject } from '@portal/controllers/deploy';
import express, {Router} from 'express'

class DeployRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-apache-projects',getApacheProjects)
        this.router.get('/get-enabled-projects',getEnabledProjects)
        this.router.post('/setup-project',setupProject)


        return this.router
    }


}

export const deployRoutes: DeployRoutes=new DeployRoutes()