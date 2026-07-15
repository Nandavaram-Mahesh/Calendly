import { Router } from 'express';
import { fetchRules, createRule, updateRule, removeRule, fetchExceptions, createException, updateException, removeException } from '../../controllers/availability.controller.js';
import { createAvailabilityExceptionSchema, createAvailabilityRuleSchema, updateAvailabilityExceptionSchema, updateAvailabilityRuleSchema } from '../../dtos/index.js';
import { validate } from '../../middlewares/validate.middleware.js';

const availabilityRouter = Router();

availabilityRouter.get('/rules', fetchRules);
availabilityRouter.post('/rules',validate(createAvailabilityRuleSchema) ,createRule);
availabilityRouter.patch('/rules/:id',validate(updateAvailabilityRuleSchema), updateRule);
availabilityRouter.delete('/rules/:id', removeRule);

availabilityRouter.get('/exceptions', fetchExceptions);
availabilityRouter.post('/exceptions',validate(createAvailabilityExceptionSchema),createException);
availabilityRouter.patch('/exceptions/:id',validate(updateAvailabilityExceptionSchema), updateException);
availabilityRouter.delete('/exceptions/:id', removeException);

export { availabilityRouter };