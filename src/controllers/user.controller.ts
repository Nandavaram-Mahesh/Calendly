import { Request, Response } from "express";
import { getAllUsers,getUserById,createUser,updateUser,deleteUser} from "../services/user.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { HTTPStatusCodes } from "../utils/http-status-code.js";

async function fetchAllUsers(_req:Request, res:Response){
    const response = await getAllUsers();
    sendSuccess(res,response);
}

async function fetchUserById(req:Request, res:Response){
    const {id} = req.params
    const response = await getUserById(Number(id));
    sendSuccess(res,response);
}

async function addUser(req:Request, res:Response){
    const data = req.body

    const newUser = await createUser(data);

    sendSuccess(res,newUser,HTTPStatusCodes.CREATED);
}

async function modifyUser(req:Request,res:Response){
    const {id} = req.params
    const {password} = req.body

    const response = await updateUser(Number(id));

    sendSuccess(res,response);
}

async function removeUser(req:Request,res:Response){
    const {id} = req.params

    const response = await deleteUser(Number(id));

    sendSuccess(res,response,HTTPStatusCodes.NO_CONTENT);
}

export {fetchAllUsers,fetchUserById,addUser,modifyUser,removeUser};


