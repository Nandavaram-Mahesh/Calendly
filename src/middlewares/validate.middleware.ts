import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../utils/error.js";

const validate = (schema:ZodType)=>{
    return (req:Request, res:Response,next:NextFunction) => {
        
        const result = schema.safeParse(req.body);

        if(!result.success){
            throw new BadRequestError(result.error.issues[0].message);
        }

        req.body = result.data;
        next();
    }
}

export {validate};
