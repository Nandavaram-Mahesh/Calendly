import { prisma } from "../config/index.js";
import { CreateEventTypeDTO, UpdateEventTypeDTO } from "../dto/index.js";

async function findAllEventTypes() {
    const eventTypes = await prisma.eventType.findMany();
    return eventTypes;
}

async function findEventTypeById(eventTypeid: number) {
    const eventType = await prisma.eventType.findUnique({where:{id:eventTypeid}});
    return eventType;
}

async function createET(data:CreateEventTypeDTO){
    const eventType = await prisma.eventType.create({data});
    return eventType;
}

async function updateET(eventTypeid: number,data:UpdateEventTypeDTO){
    const eventType = await prisma.eventType.update({where:{id:eventTypeid},data});
    return eventType;
}

async function removeET(eventTypeid:number){
    const eventType = await prisma.eventType.delete({where:{id:eventTypeid}});
    return eventType;
}

export {findAllEventTypes,findEventTypeById,createET,updateET,removeET};