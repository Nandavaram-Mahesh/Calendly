import { Router } from 'express';
import { fetchRules, createRule, updateRule, removeRule, fetchExceptions, createException, updateException, removeException } from '../../controllers/availability.controller.js';

const availabilityRouter = Router();

availabilityRouter.get('/rules', fetchRules);
availabilityRouter.post('/rules', createRule);
availabilityRouter.patch('/rules/:id', updateRule);
availabilityRouter.delete('/rules/:id', removeRule);
availabilityRouter.get('/exceptions', fetchExceptions);
availabilityRouter.post('/exceptions', createException);
availabilityRouter.patch('/exceptions/:id', updateException);
availabilityRouter.delete('/exceptions/:id', removeException);

export { availabilityRouter };