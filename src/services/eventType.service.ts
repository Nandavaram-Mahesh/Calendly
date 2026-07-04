import { CreateEventTypeDto, UpdateEventTypeDto } from "../dtos/index.js";
import { findById,findByHostId,createET,updateET,removeET,findByHostAndSlug,findActiveByHostIdAndEventSlug,slugExistsForHost,findActiveEventTypesByHost, findUserById} from "../repositories/index.js";
import {BadRequestError, ForbiddenError, generateSlug} from "../utils/index.js";


async function getAllEventTypes(hostId:number) {
    const eventTypes = await findByHostId(hostId);
    return eventTypes;
}


async function getEventTypeById(eventTypeId:number) {
    const eventType = await findById(eventTypeId);
    return eventType;
}


async function createEventType(hostId:number,data:CreateEventTypeDto) {
    const slugPassed =  data.slug ?? generateSlug(data.title);

    if(!slugPassed) throw new BadRequestError('Slug is required');
    
    const slugTaken = await slugExistsForHost(hostId,slugPassed);

    if(slugTaken) throw new BadRequestError('Slug already exists for this host');

    return createET(hostId,{...data,slug:slugPassed});
}


async function updateEventType(hostId:number,eventId:number,data:UpdateEventTypeDto) {
    const eventType = await findById(eventId);

    if(!eventType) throw new BadRequestError('Event type not found'); 
    
    if(eventType.hostId !== hostId) throw new ForbiddenError('You are not authorized to update this event type');

    const UpdatedEventType = await updateET(eventId,data);
    return UpdatedEventType;
}


async function deleteEventType(hostId:number,eventId:number) {
    
    const eventType = await findById(eventId);

    if(!eventType) throw new BadRequestError('Event type not found'); 
    
    if(eventType.hostId !== hostId) throw new ForbiddenError('You are not authorized to delete this event type');
    
    return removeET(eventId)
}

async function getEventTypePublic(hostId:number,eventSlug:string) {

    const eventType = await findActiveByHostIdAndEventSlug(hostId,eventSlug);
    
    if(!eventType) throw new BadRequestError('Event type not found');

    const host = await findUserById(hostId);

    if(!host) throw new BadRequestError('Host not found');

    return {
        eventType:{
            title:eventType.title,
            description:eventType.description,
            durationMinutes:eventType.durationMinutes,
            isActive:eventType.isActive,
            locationType:eventType.locationType,
            locationValue:eventType.locationValue
        },
        host:{
            name: host.name,
            email: host.email
        }
    }
}


export {getAllEventTypes,getEventTypeById,getEventTypePublic,createEventType,updateEventType,deleteEventType};