import express from 'express';

import {userRouter} from './user.route.js';
import { eventTypeRouter } from "./eventType.route.js";
import { publicEventTypeRouter } from './publicEventType.route.js';
import { availabilityRouter } from './availability.route.js';
import { slotRouter } from './slot.route.js';
import { googleIntegrationRouter } from './google.route.js';
import { bookingRouter } from './booking.route.js';



const router = express.Router();

router.use('/users',userRouter);
router.use('/event-types',eventTypeRouter);
router.use('/public',publicEventTypeRouter);
router.use('/availability',availabilityRouter);
router.use('/sync-slots',slotRouter);
router.use('/bookings',bookingRouter);
router.use('/integrations/google',googleIntegrationRouter)


export default router;