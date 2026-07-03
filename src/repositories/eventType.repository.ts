import { prisma } from "../config/index.js";
import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/index.js";


async function findByHostId(hostId: number) {
    const eventTypes = await prisma.eventType.findMany({where:{hostId},orderBy:{createdAt:"desc"}});
    return eventTypes;
}


async function findById(eventTypeid: number) {
    const eventType = await prisma.eventType.findUnique({where:{id:eventTypeid}});
    return eventType;
}


async function createET(hostId: number, data: CreateEventTypeDto & { slug: string}){
    
    const eventType = await prisma.eventType.create({data:{
        hostId,
        ...data
    }});
    return eventType;
}


async function updateET(id: number,data:UpdateEventTypeDto){
    const eventType = await prisma.eventType.update({where:{id},data});
    return eventType;
}


async function removeET(id:number){
    const eventType = await prisma.eventType.delete({where:{id}});
    return eventType;
}


async function findByHostAndSlug(hostId:number,slug:string){
    const eventType = await prisma.eventType.findFirst({where:{hostId,slug}});
    return eventType;
}


async function findActiveByHostIdAndEventSlug(hostId:number,slug:string){
    const eventType = await prisma.eventType.findFirst({where:{hostId,slug,isActive:true}});
    return eventType;
}


async function slugExistsForHost(hostId:number,slug:string):Promise<boolean>{
    const exsitingEventType = await prisma.eventType.findFirst({where:{hostId,slug}});
    return exsitingEventType!==null;
}


async function findActiveEventTypesByHost(hostId:number){
    const eventTypes = await prisma.eventType.findMany({where:{hostId,isActive:true}});
    return eventTypes;
}


export {findById,findByHostId,createET,updateET,removeET,findByHostAndSlug,findActiveByHostIdAndEventSlug,slugExistsForHost,findActiveEventTypesByHost};   