import { changeNetworkSettings } from '@portal/controllers/network-settings';

import express, {Router} from 'express'

class NetworkRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.post('/change-netplan-ip',changeNetworkSettings)



        return this.router
    }


}

export const networkRoutes: NetworkRoutes=new NetworkRoutes()