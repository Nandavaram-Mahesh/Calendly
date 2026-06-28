import {Router} from 'express';
import { addEventType, fetchAllEventTypes, fetchEventTypeById, modifyEventType, removeEventType } from '../../controllers/index.js';
import { createEventTypeSchema, updateEventTypeSchema } from '../../dto/index.js';
import { validate } from '../../middlewares/index.js';


const eventTypeRouter:Router = Router();

eventTypeRouter.get('/',fetchAllEventTypes);

eventTypeRouter.get('/:id',fetchEventTypeById);

eventTypeRouter.post('/',validate(createEventTypeSchema),addEventType);

eventTypeRouter.patch('/:id',validate(updateEventTypeSchema),modifyEventType);

eventTypeRouter.delete('/:id',removeEventType);

export {eventTypeRouter};