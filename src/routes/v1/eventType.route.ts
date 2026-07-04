import {Router} from 'express';
import { addEventType, fetchAllEventTypes, fetchEventTypeById, getPublicEventType, modifyEventType, removeEventType } from '../../controllers/index.js';
import { createEventTypeSchema, updateEventTypeSchema } from '../../dtos/index.js';
import { validate } from '../../middlewares/index.js';
import { requireUserId } from '../../middlewares/requireUserId.middleware.js';


const eventTypeRouter:Router = Router();

eventTypeRouter.use(requireUserId);

eventTypeRouter.get('/',fetchAllEventTypes);

eventTypeRouter.get('/:id',fetchEventTypeById);

eventTypeRouter.post('/',validate(createEventTypeSchema),addEventType);

eventTypeRouter.patch('/:id',validate(updateEventTypeSchema),modifyEventType);

eventTypeRouter.delete('/:id',removeEventType);



export {eventTypeRouter};