import {addSystemPorts, deleteSystemPorts } from '@portal/controllers/ports';


import express, {Router} from 'express'

class Ports{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        // this.router.get('/get-system-ports',getSystemPorts)
        this.router.post('/add-system-ports',addSystemPorts)
        this.router.delete('/delete-system-ports',deleteSystemPorts)

        return this.router
    }


}
export const ports: Ports=new Ports()