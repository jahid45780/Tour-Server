import express from "express";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../auth/authCheck";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingZodSchema } from "./booking.validation";

const router = express.Router()

router.post("/",
checkAuth(...Object.values(Role)),
validateRequest(createBookingZodSchema),
BookingController.createBooking)


export const BookingRoutes = router