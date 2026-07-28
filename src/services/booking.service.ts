import { Slot } from "../../generated/prisma/client.js";
import { prisma } from "../config/database.js";
import { createBookingDto } from "../dtos/booking.dto.js";
import { createBooking } from "../repositories/booking.repository.js";
import { findSlotById, markSlotBookedIfAvailable } from "../repositories/slot.repository.js";
import { startRegenerateHostSlotsWorkflow } from "../temporal/client.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";


async function triggerSlotRegen(hostId: number, slotStartAt: Date){

    const date = slotStartAt.toISOString().split('T')[0];
    
    await startRegenerateHostSlotsWorkflow({
        hostId,
        from:date,
        to:date
    });
    
    console.log(`[booking] Triggering slot regeneration for host ${hostId} on ${date}`);
}


function formatBookingResponse(booking: {
    id: number;
    status: string;
    slot: { startAt: Date; endAt: Date };
}) {
    return {
        booking: {
            id: booking.id,
            status: booking.status,
            startAt: booking.slot.startAt.toISOString(),
            endAt: booking.slot.endAt.toISOString(),
        },
    };
}

function validateSlotForBooking(slot:Slot|null){
    
    if(!slot) throw new NotFoundError('Slot not found');

    if(slot.status!=="AVAILABLE") throw new BadRequestError('Slot is not available');

    if(slot.startAt <= new Date()) throw new BadRequestError('Slot has already started');

    return slot
}


async function postBookingActions(hostId: number, booking: {
    id: number;
    status: string;
    slot: { startAt: Date; endAt: Date };
}) {
    await triggerSlotRegen(hostId,booking.slot.startAt);
    return formatBookingResponse(booking)
}


export async function createtBookingOptimistically(hostId:number,dto:createBookingDto){

    const booking = await prisma.$transaction(
        async (tx) => {
        
        const slot = validateSlotForBooking(await findSlotById(dto.slotId,tx));

        const updated  = await markSlotBookedIfAvailable(dto.slotId,tx);

        if(updated.count !==1 ) throw new BadRequestError('Slot is not available');

        return createBooking({
                slotId: dto.slotId,
                inviteeEmail: dto.inviteeEmail,
                inviteeName: dto.inviteeName,
                inviteeNotes: dto.inviteeNotes,
                hostId,
                eventTypeId: slot.eventTypeId,
            },
            tx
        )

    }
    )

    return postBookingActions(hostId,booking)
}

