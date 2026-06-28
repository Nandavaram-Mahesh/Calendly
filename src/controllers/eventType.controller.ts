import { Request, Response } from "express";
import { createEventType, deleteEventType, getAllEventTypes, getEventTypeById, updateEventType } from "../services/index.js";
import { HTTPStatusCodes, sendSuccess } from "../utils/index.js";

async function fetchAllEventTypes(req:Request,res:Response) {
    const response = await getAllEventTypes();
    sendSuccess(res,response);
}

async function fetchEventTypeById(req:Request,res:Response) {
    const {id} = req.params
    const response = await getEventTypeById(Number(id));
    sendSuccess(res,response);
}

async function addEventType(req:Request,res:Response) {
    const data = req.body
    const response = await createEventType(data);
    sendSuccess(res,response,HTTPStatusCodes.CREATED);
}

async function modifyEventType(req:Request,res:Response) {
    const {id} = req.params
    const data = req.body
    const response = await updateEventType(Number(id),data);
    sendSuccess(res,response);
}

async function removeEventType(req:Request,res:Response) {
    const {id} = req.params
    const response = await deleteEventType(Number(id));

    sendSuccess(res,response,HTTPStatusCodes.NO_CONTENT);
}

export {fetchAllEventTypes, fetchEventTypeById, addEventType, modifyEventType, removeEventType};