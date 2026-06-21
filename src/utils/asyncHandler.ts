import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncController  = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>


const asyncHandler = (controller:AsyncController):RequestHandler  => {
    return (req:Request, res:Response, next:NextFunction) => {
        Promise.resolve(controller(req, res, next)).catch(next)
    }
};

export {asyncHandler};