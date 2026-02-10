import { Router } from "express";
import { DivisionController } from "./division.controller";

const router  = Router()


router.post('/create', DivisionController.createDivision)

export const DivisionRoutes = router