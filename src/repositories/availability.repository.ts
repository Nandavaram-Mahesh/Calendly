import {prisma} from '../config/index.js';
import { CreateAvailabilityExceptionDto, CreateAvailabilityRuleDto, UpdateAvailabilityExceptionDto, UpdateAvailabilityRuleDto } from '../dtos/availability.dto.js';

async function findRuleById(id:number){
    const availabilityRule = await prisma.availabilityRule.findUnique({where:{id}});
    return availabilityRule;    
}

async function findRuleByHostId(hostId:number){
    const availabilityRule = await prisma.availabilityRule.findMany({where:{id:hostId},orderBy: [{ weekday: "asc" }, { startTime: "asc" }],});
    return availabilityRule;
}

async function findRuleByHostIdAndWeekday(hostId:number,weekday:number){
    const availabilityRule = await prisma.availabilityRule.findMany({where:{id:hostId,weekday}});
    return availabilityRule;
}


async function findActiveRuleByHost(hostId:number){
    return prisma.availabilityRule.findMany({
        where: { hostId, isActive: true },
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    });
}


async function createRule(hostId:number,data:CreateAvailabilityRuleDto){
    const availabilityRule = await prisma.availabilityRule.create({
        data:{...data,userId:hostId}
    });
    return availabilityRule;
}

function updateRule(id:number,data:UpdateAvailabilityRuleDto){
    const availabilityRule = prisma.availabilityRule.update({
        where:{id},
        data
    })
    return availabilityRule;
}

function removeRule(id:number){
    const availabilityRule = prisma.availabilityRule.delete({where:{id}});
    return availabilityRule;
}

// Exceptions

async function findExceptionByHost(hostId:number){
    const exceptions = await prisma.availabilityException.findMany({where:{userId:hostId},orderBy: { date: "asc" }});
    return exceptions;
}

async function findExceptionById(id:number){
    const exception = await prisma.availabilityException.findUnique({where:{id}});
    return exception;
}


async function createException(hostId:number,data:CreateAvailabilityExceptionDto){
    const {date,...rest} = data
    const availabilityException = await prisma.availabilityException.create({data:{
        ...rest,
        userId:hostId,
        date:new Date(`${date}T00:00:00.000Z`)
    }
    });
    return availabilityException;
}


async function updateException(id:number,data:UpdateAvailabilityExceptionDto){
    const { date, ...rest } = data;
    const availabilityException = await prisma.availabilityException.update({where:{id},
        data:{
            ...rest,
            ...(date!==undefined && {date:new Date(`${date}T00:00:00.000Z`)})
        }});
    return availabilityException;
}


async function removeException(id:number){
    const availabilityException = await prisma.availabilityException.delete({where:{id}});
    return availabilityException;
}

async function findExceptionsByUserInRange(
    userId: number,
    startDate: Date,
    endDate: Date
) {
    return prisma.availabilityException.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { date: "asc" },
    });
}

export { findRuleById,findRuleByHostId,findRuleByHostIdAndWeekday,findActiveRuleByHost,createRule,updateRule,removeRule,findExceptionByHost,findExceptionById,createException,updateException,removeException,findExceptionsByUserInRange };