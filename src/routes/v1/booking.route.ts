import { Router } from "express";
import { requireUserId } from "../../middlewares/requireUserId.middleware.js";
import { createBookingSchema } from "../../dtos/booking.dto.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { cancel, create } from "../../controllers/booking.controller.js";



export const bookingRouter: Router = Router();

bookingRouter.use(requireUserId);

bookingRouter.post("/", validate(createBookingSchema), create);

bookingRouter.patch("/:bookingId/cancel", cancel);