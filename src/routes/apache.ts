import { disableSys, enableSys, getEnabledProjects } from '@portal/controllers/apache';


import express, {Router} from 'express'

class Apache{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.post('/enable-system',enableSys)
        this.router.post('/disable-system',disableSys)
        this.router.get('/get-enabled-projects',getEnabledProjects)


        return this.router
    }


}
export const apache: Apache=new Apache()