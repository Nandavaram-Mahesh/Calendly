import { Request, Response } from "express";
import { getAllUsers,getUserById,createUser,updateUser,deleteUser} from "../services/user.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { HTTPStatusCodes } from "../utils/http-status-code.js";

async function fetchAllUsers(_req:Request, res:Response){
    const users = await getAllUsers();
    sendSuccess(res,users);
}

async function fetchUserById(req:Request, res:Response){
    const {id} = req.params
    const user = await getUserById(Number(id));
    sendSuccess(res,user);
}

async function addUser(req:Request, res:Response){
    const data = req.body

    const user = await createUser(data);

    sendSuccess(res,user,HTTPStatusCodes.CREATED,'User created successfully');
}

async function modifyUser(req:Request,res:Response){
    const {id} = req.params

    const response = await updateUser(Number(id),req.body);

    sendSuccess(res,response,HTTPStatusCodes.OK,'User updated successfully');
}

async function removeUser(req:Request,res:Response){
    const {id} = req.params

    const response = await deleteUser(Number(id));

    sendSuccess(res,response,HTTPStatusCodes.NO_CONTENT,'User deleted successfully');
}

export {fetchAllUsers,fetchUserById,addUser,modifyUser,removeUser};


