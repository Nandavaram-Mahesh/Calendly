import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/index.js";

export  function requireUserId(req:Request,_res:Response,next:NextFunction){
    const userIdHeader = req.headers["x-user-id"]

    if(!userIdHeader || typeof userIdHeader !== 'string'){ 
        throw new UnauthorizedError('x-user-id is required')
    }

    const userId = Number(userIdHeader)

    if(Number.isNaN(userId)){
        throw new BadRequestError('x-user-id must be a number')
    }

    req.userId = userId
    
    next()

}