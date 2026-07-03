import { Request, Response } from "express";
import { createEventType, deleteEventType, getAllEventTypes, getEventTypeById, updateEventType,getEventTypePublic } from "../services/index.js";
import { HTTPStatusCodes, sendSuccess } from "../utils/index.js";


async function fetchAllEventTypes(req:Request,res:Response) {
    const response = await getAllEventTypes(req.userId);
    sendSuccess(res,response);
}

async function fetchEventTypeById(req:Request,res:Response) {
    const {id} = req.params
    const response = await getEventTypeById(Number(id));
    sendSuccess(res,response);
}

async function addEventType(req:Request,res:Response) {
    const data = req.body
    const response = await createEventType(req.userId,data);
    sendSuccess(res,response,HTTPStatusCodes.CREATED,'Event type created successfully');
}

async function modifyEventType(req:Request,res:Response) {
    const {id} = req.params
    const data = req.body
    const response = await updateEventType(req.userId,Number(id),data);
    sendSuccess(res,response,HTTPStatusCodes.OK,'Event type updated successfully');
}

async function removeEventType(req:Request,res:Response) {
    const {id} = req.params
    const response = await deleteEventType(req.userId,Number(id));
    sendSuccess(res,response,HTTPStatusCodes.OK,'Event type deleted successfully');
}

async function getPublicEventType(req:Request,res:Response){
    const { userId, slug } = req.params;
    const eventType = await getEventTypePublic(Number(userId),String(slug)); 
    sendSuccess(res,eventType);
}

export {fetchAllEventTypes, fetchEventTypeById, addEventType, modifyEventType, removeEventType,getPublicEventType};