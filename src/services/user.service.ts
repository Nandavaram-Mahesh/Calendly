import { getAll, getOne } from "../repositories/user.repository.js";
import { NotFoundError } from "../utils/error.js";

export async function findAllUsers(){
 const users =  await getAll();
 return users;   
}

export async function getUserById(id:number){
    const user =  await getOne(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    return user
}