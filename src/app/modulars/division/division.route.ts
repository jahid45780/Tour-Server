import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuth } from "../auth/authCheck";
import { Role } from "../users/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

const router  = Router()


router.post('/create', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
validateRequest(createDivisionSchema),
DivisionController.createDivision)

router.get('/', DivisionController.getAllDivisions)

router.get('/:slug',DivisionController.getSingleDivision)

router.post('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN),  
validateRequest(updateDivisionSchema),
DivisionController.updateDivision)

router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

export const DivisionRoutes = router