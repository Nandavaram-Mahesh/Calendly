import { prisma } from "../config/database.js";
import { DbClient, getDbClient } from "./db-client.js";
import { Prisma } from "../../generated/prisma/client.js";


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

export async function updateSlotStatus(slotId:string , db?: DbClient) {
    
    const client = getDbClient(db);

    await client.slot.update({
        where: { id: slotId },
        data: { status: "AVAILABLE" },
    });
}

export async function bulkUpsertAvailableSlots(rows:{id:string,hostId: number, eventTypeId: number, startAt: Date, endAt: Date, status: string,updatedAt:Date}[]){

    if (rows.length === 0) return;

    const values = []

    for (const row of rows) {
        values.push(
            Prisma.sql `
            (
                ${row.id},
                ${row.hostId},
                ${row.eventTypeId},
                ${row.startAt},
                ${row.endAt},
                ${row.status},
                ${row.updatedAt}
            )`
            );
    }
     


    const query = Prisma.sql `

                INSERT INTO "slots" ("id","hostId","eventTypeId","startAt","endAt","status","updatedAt")

                VALUES

                ${Prisma.join(values)}

                ON CONFLICT ("eventTypeId","startAt","endAt")

                DO UPDATE

                SET

                status = EXCLUDED.status
            

            `;
    
    await prisma.$executeRaw(query);
    
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


export async function findSlotById(slotId: string, db?: DbClient) {
    const client = getDbClient(db);

    return client.slot.findUnique({
         where: { id: slotId } 
        }); 
}

export async function markSlotBookedIfAvailable(id: string, db?: DbClient) {
    const client = getDbClient(db);

    return client.slot.updateMany({
        where: {
            id,
            status: "AVAILABLE",
        },
        data: {
            status: "BOOKED",
        },
    });
}
