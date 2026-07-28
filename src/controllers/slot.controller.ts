import { Request, Response } from "express";
import { regenerateHostSlots } from "../services/slot.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function regenerateHostSlotsHandler(req: Request, res: Response) {
    const slots = await regenerateHostSlots({hostId:req.userId});
    sendSuccess(res, slots);
}