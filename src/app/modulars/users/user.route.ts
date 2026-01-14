import {  Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../auth/authCheck";
import { Role } from "./user.interface";





const router = Router()

router.post('/register', validateRequest(createUserZodSchema), userController.createUser)

router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUsers )
router.patch("/:id", checkAuth(...Object.values(Role)), userController.updateUser)

 export const userRouter = router;