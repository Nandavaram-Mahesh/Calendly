import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.js";

const globalErrorHandler= (err:any,_req:Request,res:Response,_next:NextFunction) =>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({ success: false,error:err.code,message:err.message});
    }

    console.log("Unhandled Error",err);

    return res.status(500).json({ 
        success: false,
        error: "SERVER_ERROR",
        message: "Internal Server Error"
    });
}

export {globalErrorHandler};
