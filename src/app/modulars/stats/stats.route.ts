
import express from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../auth/authCheck";
import { Role } from "../users/user.interface";


const router  = express.Router()

router.get("/user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),  StatsController.getUserStats)
router.get('/tour',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getTourStats)
router.get('/booking',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getBookingStats)
router.get('/payment', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getPaymentStats)

export const StatsRoutes = router