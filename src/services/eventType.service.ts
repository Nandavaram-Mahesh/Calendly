import { CreateEventTypeDTO, UpdateEventTypeDTO } from "../dto/index.js";
import { findAllEventTypes, findEventTypeById ,createET, updateET, removeET} from "../repositories/index.js";

async function getAllEventTypes() {
    const eventTypes = await findAllEventTypes();
    return eventTypes;
}

async function getEventTypeById(id:number) {
    const eventType = await findEventTypeById(id);
    return eventType;
}

async function createEventType(data:CreateEventTypeDTO) {
    const eventType = await createET(data);
    return eventType;
}

async function updateEventType(id:number,data:UpdateEventTypeDTO) {
    const UpdatedEventType = await updateET(id,data);
    return UpdatedEventType;
}

async function deleteEventType(id:number) {
    const deletedEventType = await removeET(id);
    return deletedEventType;
}

export {getAllEventTypes,getEventTypeById,createEventType,updateEventType,deleteEventType};