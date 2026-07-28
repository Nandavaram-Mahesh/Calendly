import {Router} from 'express';
import { regenerateHostSlots } from '../../services/slot.service.js';
import { requireUserId } from '../../middlewares/requireUserId.middleware.js';
import { regenerateHostSlotsHandler } from '../../controllers/slot.controller.js';


const slotRouter:Router = Router();

slotRouter.use(requireUserId);

slotRouter.post('/',regenerateHostSlotsHandler);

export {slotRouter};