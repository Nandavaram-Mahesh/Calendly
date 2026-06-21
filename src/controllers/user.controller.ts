import { Request, Response } from "express";
import { findAllUsers as findAllUsersService , getUserById as getUserByIdService,createUser as createUserService , updateUser as updateUserService , deleteUser as deleteUserService } from "../services/user.service.js";

async function findAllUsers(_req:Request, res:Response){
    const response = await findAllUsersService();
    res.json(response);
}

async function getUserById(req:Request, res:Response){
    const {id} = req.params
    const response = await getUserByIdService(Number(id));

    res.json(response);
}

async function createUser(req:Request, res:Response){
    const {email,password} = req.body

    const response = await createUserService(email,password);

    res.json(response);
}

async function updateUser(req:Request,res:Response){
    const {id} = req.params
    const {password} = req.body

    const response = await updateUserService(Number(id));

    return res.json(response);
}

async function deleteUser(req:Request,res:Response){
    const {id} = req.params

    const response = await deleteUserService(Number(id));

    return res.json(response);
}
export {findAllUsers,getUserById,createUser,updateUser , deleteUser};


