import { Response } from "express";
interface SuccessPayload<T>{
    success: boolean;
    data: T;
    message?: string;
}
function sendSuccess<T>(res:Response,data:T,statusCode:number=200,message?:string):void{
    const body:SuccessPayload<T> = {success:true,data};
    res.status(statusCode).json(body);
}


export{sendSuccess}