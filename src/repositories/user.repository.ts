import { prisma } from "../config/index.js";

async function findAll(){
    const users = await prisma.user.findMany();
    return users;
}

async function findById(id:number){
    const user = await prisma.user.findUnique({where:{id}});
    return user;
}

async function findByEmail(email:string){
    const user = await prisma.user.findUnique({where:{email}});
    return user;
}


async function create(email:string,password:string){    
    const user = await prisma.user.create({
        data:{
            email,
            password
        }
    });    
    return user;    
}

async function remove(id:number){    
    const user = await prisma.user.delete({where:{id}});    
    return user;    
}

export {findAll,findById,findByEmail,create,remove};