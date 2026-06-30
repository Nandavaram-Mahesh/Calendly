import { User } from "../../generated/prisma/client.js";
import { prisma } from "../config/index.js";
import { CreateUserDto ,UpdateUserDto} from "../dtos/index.js";

async function findAllUsers(){
    const users = await prisma.user.findMany();
    return users;
}

async function findUserById(id:number):Promise<User|null> {
    const user = await prisma.user.findUnique({where:{id}});
    return user;
}

async function findUserByEmail(email:string):Promise<User|null> {
    const user = await prisma.user.findUnique({where:{email}});
    return user;
}


async function create(data:CreateUserDto & { slug: string }){    
    const user = await prisma.user.create({
        data
    });    
    return user;    
}

async function update(id:number,data:UpdateUserDto){
    const user = await prisma.user.update({where:{id},data});    
    return user;
}

async function remove(id:number){    
    const user = await prisma.user.delete({where:{id}});    
    return user;    
}

export {findAllUsers,findUserById,findUserByEmail,create,update,remove};