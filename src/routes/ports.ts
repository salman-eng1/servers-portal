import {deleteSystemPorts, getSystemPorts } from '@portal/controllers/ports';


import express, {Router} from 'express'

class Ports{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/get-system-ports',getSystemPorts)
        this.router.get('/delete-system-ports',deleteSystemPorts)

        return this.router
    }


}
export const ports: Ports=new Ports()