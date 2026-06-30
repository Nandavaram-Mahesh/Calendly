import { User } from "../../generated/prisma/client.js";

import { CreateUserDto,UpdateUserDto } from "../dtos/index.js";
import { BadRequestError, generateUserSlug, NotFoundError } from "../utils/index.js";
import {findAllUsers,findUserById,findUserByEmail,create,update,remove} from "../repositories/index.js";


async function createUser(data:CreateUserDto):Promise<User>{
    
    const existingUser = await findUserByEmail(data.email);

    if(existingUser) throw new BadRequestError('User already exists'); 
    
    const slugParsed = data.slug ? data.slug : generateUserSlug(); 
    
    return create({...data,slug: slugParsed})
}


async function getAllUsers():Promise<User[]> {
 const users =  await findAllUsers();
 return users;   
}


async function getUserById(id:number):Promise<User> {
    const user =  await findUserById(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    return user
}


async function updateUser(id:number,data:UpdateUserDto):Promise<User>{
    const user  = await findUserById(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    if(data.email && data.email !== user.email){
        const existingUser = await findUserByEmail(data.email);
        if(existingUser) throw new BadRequestError('User with this email already exists');
    }

    return update(id,data)
}


async function deleteUser(id:number):Promise<User>{
    
    const user =  await findUserById(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    return remove(id);
}


export {createUser,getAllUsers,getUserById,updateUser,deleteUser};
