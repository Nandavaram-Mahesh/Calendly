import { Request, Response } from "express";
import { findAllUsers as findAllUsersService , getUserById as getUserByIdService } from "../services/user.service.js";

async function findAllUsers(_req:Request, res:Response){
    const response = await findAllUsersService();
    res.json(response);
}

async function getUserById(req:Request, res:Response){
    const {id} = req.params
    const response = await getUserByIdService(Number(id));

    res.json(response);
}

export {findAllUsers,getUserById};

