import { getSystems,getSystemProjects } from '@portal/controllers/enable-system';
// import { getSystemPorts } from '@portal/controllers/ports';


import express, {Router} from 'express'

class DeployRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-systems',getSystems)
        this.router.get('/get-system-projects', getSystemProjects)
        // this.router.get('/get-system-ports',getSystemPorts)



        return this.router
    }


}

export const deployRoutes: DeployRoutes=new DeployRoutes()