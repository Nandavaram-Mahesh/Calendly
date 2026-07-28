import { prisma } from "../config/database.js";
import { createBookingDto } from "../dtos/booking.dto.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";

export async function createtBookingOptimistically(hostId:number,dto:createBookingDto){

    const booking = await prisma.$transaction(
        async (tx) => {
        
        const slot = await tx.slot.findUnique({where:{id:dto.slotId}})

        if(!slot) throw new NotFoundError('Slot not found');

        if(slot.status!=="AVAILABLE") throw new BadRequestError('Slot is not available');

        if(slot.startAt <= new Date()) throw new BadRequestError('Slot has already started');

        const updated  = await tx.slot.updateMany({
            where: {
                id: dto.slotId,
                status: "AVAILABLE",
            },
            data: {
                status: "BOOKED",
            },
        })

        if(updated.count !==1 ) throw new BadRequestError('Slot is not available');

        return tx.booking.create({
            data:{
                slotId: dto.slotId,
                inviteeEmail:dto.inviteeEmail,
                inviteeName:dto.inviteeName,
                inviteeNotes:dto.inviteeNotes,
                status:"CONFIRMED",
                hostId,
                eventTypeId:slot.eventTypeId
            },
            include:{
                    slot:true
                }
            
            
        })

    }
    )

    return {
        booking:{
            id:booking.id,
            status:booking.status,
            startAt:booking.slot.startAt.toISOString(),
            endAt:booking.slot.endAt.toISOString()
        }
    }
}

