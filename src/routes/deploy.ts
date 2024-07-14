import { getSystems,getSystemProjects, getEnabledProjects,setupProject } from '@portal/controllers/deploy';
import express, {Router} from 'express'

class DeployRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-systems',getSystems)
        this.router.get('/get-system-projects', getSystemProjects)
        this.router.get('/get-enabled-projects',getEnabledProjects)
        this.router.post('/setup-project',setupProject)


        return this.router
    }


}

export const deployRoutes: DeployRoutes=new DeployRoutes()