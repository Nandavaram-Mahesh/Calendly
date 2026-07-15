import {userRouter} from './user.route.js';
import { eventTypeRouter } from "./eventType.route.js";
import { publicEventTypeRouter } from './publicEventType.route.js';
import { availabilityRouter } from './availability.route.js';

import express from 'express';


const router = express.Router();

router.use('/users',userRouter);
router.use('/event-types',eventTypeRouter);
router.use('/public',publicEventTypeRouter);
router.use('/availability',availabilityRouter);


export default router;