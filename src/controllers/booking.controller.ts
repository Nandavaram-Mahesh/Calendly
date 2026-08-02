import { Request, Response } from "express";
import { cancelBooking, createtBookingOptimistically } from "../services/booking.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function create(req: Request, res: Response) {
    
    const result = await createtBookingOptimistically(req.userId, req.body);
    
    sendSuccess(res, result, 201, "Booking created successfully");

}

export async function cancel(req: Request, res: Response) {
    
    const {bookingId} = req.params
    
    await cancelBooking(req.userId,Number(bookingId))

    sendSuccess(res,"Booking cancelled successfully");
}