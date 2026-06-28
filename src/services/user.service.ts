import { createUserDTO } from "../dto/index.js";
import {findAll,findById,findByEmail,create,remove} from "../repositories/index.js";
import { BadRequestError, NotFoundError } from "../utils/index.js";


async function createUser(data:createUserDTO):Promise<any>{
    // if user  already exists throw error
    const existingUser = await findByEmail(data.email);

    if(existingUser) throw new BadRequestError('User already exists'); 
    
    // create user
    const user = await create(data.email,data.password);
    
    return user
}


async function getAllUsers(){
 const users =  await findAll();
 return users;   
}


async function getUserById(id:number){
    const user =  await findById(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    return user
}


async function updateUser(id:number){

}

async function deleteUser(id:number){
    
    const user =  await findById(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    const deletedUser = await remove(id);
    
    return deletedUser
}


export {createUser,getAllUsers,getUserById,updateUser,deleteUser};
