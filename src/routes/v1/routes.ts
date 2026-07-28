import express from 'express';

import {userRouter} from './user.route.js';
import { eventTypeRouter } from "./eventType.route.js";
import { publicEventTypeRouter } from './publicEventType.route.js';
import { availabilityRouter } from './availability.route.js';
import { slotRouter } from './slot.route.js';



const router = express.Router();

router.use('/users',userRouter);
router.use('/event-types',eventTypeRouter);
router.use('/public',publicEventTypeRouter);
router.use('/availability',availabilityRouter);
router.use('/sync-slots',slotRouter);


export default router;