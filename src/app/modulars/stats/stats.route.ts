
import express from "express";
import { StatsController } from "./stats.controller";


const router  = express.Router()

router.get("/user", StatsController.getUserStats)
router.get('/tour', StatsController.getTourStats)

export const StatsRoutes = router