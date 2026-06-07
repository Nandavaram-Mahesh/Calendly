import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { DATABASE_URL } from "./env.js";


const connectionString = `${DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


export async function connectDatabase(){
    try{
        await prisma.$connect();
        console.log("Database: Connected Successfully");
    }
    catch(error){
        console.log("Database: Connection Failed");
        process.exit(1);
    }
}

export { prisma };