import { getSystems,getSystemProjects } from '@portal/controllers/enable-system';


import express, {Router} from 'express'

class DeployRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-systems',getSystems)
        this.router.get('/get-system-projects', getSystemProjects)



        return this.router
    }


}

export const deployRoutes: DeployRoutes=new DeployRoutes()