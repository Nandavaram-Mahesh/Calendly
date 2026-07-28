import { sendBookingConfirmationEmail } from "../../mailer/booking.mailer.js";
import { regenerateHostSlots as runSlotGeneration, RegenerateHostSlotsInput } from "../../services/slot.service.js";

export async function regenerateHostSlotsActivity(input:RegenerateHostSlotsInput){
    await runSlotGeneration(input); 
}

export async function sendBookingConfirmationEmailActivity(bookingId: number) {
    await sendBookingConfirmationEmail(bookingId);
}