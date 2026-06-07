import { prisma } from "../config/database.js";

async function getAll(){
    const users = await prisma.user.findMany();
    return users;
}

async function getOne(id:number){
    const user = await prisma.user.findUnique({where:{id}});
    return user;
}

export {getAll,getOne}