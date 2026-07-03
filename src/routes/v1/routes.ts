import {userRouter} from './user.route.js';
import { eventTypeRouter } from "./eventType.route.js";

import express from 'express';


const router = express.Router();

router.use('/users',userRouter);
router.use('/event-types',eventTypeRouter);
router.use('/public',eventTypeRouter);


export default router;