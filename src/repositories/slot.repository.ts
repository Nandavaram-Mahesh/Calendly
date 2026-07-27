import { prisma } from "../config/database.js";

export async function findBookedSlotsByHostInRange(hostId: number, startDate: Date, endDate: Date){
    return  prisma.slot.findMany({
        where:{
        hostId,
        startAt: {
                gte: startDate,
                lte: endDate,
            },
         status: "BOOKED"
        },
        
    })
};

export async function upsertAvailableSlot(hostId: number, startAt: Date, endAt: Date, eventTypeId: number) {

    return prisma.slot.upsert({
        where:{
            eventTypeId_startAt_endAt:{eventTypeId,startAt,endAt}
        },
        create: {
            startAt,
            endAt,
            hostId,
            eventTypeId,
            status: "AVAILABLE"
        },
        update: {
            status: "AVAILABLE"
        }
    })

}


export async function findFutureSlotsByEventTypeInRange(eventTypeId: number, startDate: Date, endDate: Date) {

    return prisma.slot.findMany({
        where: {
            eventTypeId,
            startAt: {
                gte: startDate,
                lte: endDate,
            },
            status: {in: ["AVAILABLE", "BLOCKED"]}
        },
    });
}

export async function blockSlot(slotId: string) {
    return prisma.slot.update({ where: { id: slotId }, data: { status: "BLOCKED" } }); 
}