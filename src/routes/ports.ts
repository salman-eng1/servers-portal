import {getSystemPorts } from '@portal/controllers/ports';


import express, {Router} from 'express'

class Ports{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-system-ports',getSystemPorts)
        return this.router
    }


}
export const ports: Ports=new Ports()