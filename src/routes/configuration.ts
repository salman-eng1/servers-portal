import { clearProjectCache, fixProjectPermissions, fixProjectSymlinks, migrateProjetctDB } from '@portal/controllers/configuration';


import express, {Router} from 'express'

class Config{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.post('/migrate-fresh',migrateProjetctDB)
        this.router.post('/clear-cache',clearProjectCache)
        this.router.post('/fix-symlinks',fixProjectSymlinks)
        this.router.post('/fix-permissions',fixProjectPermissions)


        
        return this.router
    }


}
export const config: Config=new Config()