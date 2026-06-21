import { createNewUser, deleteExistingUser, getAll, getOne, getUserByEmail } from "../repositories/user.repository.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";


async function createUser(email:string,password:string):Promise<any>{
    // if user  already exists throw error
    const existingUser = await getUserByEmail(email);

    if(existingUser) throw new BadRequestError('User already exists'); 
    
    // create user
    const user = await createNewUser(email,password);
    
    return user
}


async function findAllUsers(){
 const users =  await getAll();
 return users;   
}


async function getUserById(id:number){
    const user =  await getOne(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    return user
}


async function updateUser(id:number){

}

async function deleteUser(id:number){
    
    const user =  await getOne(id)
    
    if(!user) throw new NotFoundError('User not found');
    
    const deletedUser = await deleteExistingUser(id);
    
    return deletedUser
}


export {createUser,findAllUsers,getUserById,updateUser,deleteUser}
