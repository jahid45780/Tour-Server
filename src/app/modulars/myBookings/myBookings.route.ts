import { Router } from "express";
import { checkAuth } from "../auth/authCheck";
import { BookingController } from "./myBookings.controller";
import { Role } from "../users/user.interface";

const router = Router();


router.get(
  "/bookings",
  checkAuth(Role.USER, Role.ADMIN),
  BookingController.getMyBookings
);

export const BookingsRoutes = router;