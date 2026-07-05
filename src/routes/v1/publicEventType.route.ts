import {Router } from 'express';
import { getPublicEventType } from '../../controllers/index.js';

const publicEventTypeRouter:Router = Router();

publicEventTypeRouter.get('/users/:userId/event-types/:slug',getPublicEventType);

export {publicEventTypeRouter};