import { prisma } from "../config/database.js";

async function getAll(){
    const users = await prisma.user.findMany();
    return users;
}

async function getOne(id:number){
    const user = await prisma.user.findUnique({where:{id}});
    return user;
}

async function getUserByEmail(email:string){
    const user = await prisma.user.findUnique({where:{email}});
    return user;
}


async function createNewUser(email:string,password:string){    
    const user = await prisma.user.create({
        data:{
            email,
            password
        }
    });    
    return user;    
}

async function deleteExistingUser(id:number){    
    const user = await prisma.user.delete({where:{id}});    
    return user;    
}

export {getAll,getOne,getUserByEmail,createNewUser,deleteExistingUser};