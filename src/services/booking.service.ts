import { Slot } from "../../generated/prisma/client.js";
import { prisma } from "../config/database.js";
import { createBookingDto } from "../dtos/booking.dto.js";
import { cancelBookedSlot, createBooking } from "../repositories/booking.repository.js";
import { findSlotById, markSlotBookedIfAvailable, updateSlotStatus } from "../repositories/slot.repository.js";
import { starBookingNotificationWorkflow, startCancelBookingNotificationWorkflow, startCreateGoogleCalendarEventWorkflow, startRegenerateHostSlotsWorkflow } from "../temporal/client.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";
import { DateTime } from "luxon";

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
    
    await starBookingNotificationWorkflow(booking.id);

    await startCreateGoogleCalendarEventWorkflow(booking.id);

    return formatBookingResponse(booking)
}



async function postCancelBookingActions(hostId:number,booking:{
    id: number;
    status: string;
    slot: { startAt: Date; endAt: Date };
}){

    await triggerSlotRegen(hostId,booking.slot.startAt);
    
    await startCancelBookingNotificationWorkflow(booking.id);

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

export async function cancelBooking( hostId:number,bookingId: number) {
    const cancelledBooking = await prisma.$transaction(
        async (tx) => {

            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { slot: true },
            });

            if (!booking) {
                throw new BadRequestError("Booking not found");
            }

            if (booking.status === "CANCELLED") {
                throw new BadRequestError("Booking already cancelled");
            }

            const slotStartAt = DateTime.fromJSDate(booking.slot.startAt,{zone:'utc'});

            if (DateTime.now().toUTC()>=slotStartAt) {
                throw new BadRequestError("Cannot cancel a booking that has already started");
            }

           const updatedBooking =  await cancelBookedSlot(bookingId, tx);

           await updateSlotStatus(updatedBooking.slotId,tx)

           return updatedBooking
        }
    )

    
    return postCancelBookingActions(hostId,cancelledBooking)
}
