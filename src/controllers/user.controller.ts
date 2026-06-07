import { Request, Response } from "express";
import { findAllUsers as findAllUsersService , getUserById as getUserByIdService } from "../services/user.service.js";

function findAllUsers(_req:Request, res:Response){
    const response = findAllUsersService();
    res.json(response);
}

function getUserById(req:Request, res:Response){
    const {id} = req.params
    const response = getUserByIdService(Number(id));

    res.json(response);
}

export {findAllUsers,getUserById};

