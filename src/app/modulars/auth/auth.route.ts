import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "./authCheck";
import { Role } from "../users/user.interface";

const router = Router()

router.post('/login',authController.credentialsLogin)
router.post('/refresh-token',authController.getNewAccessToken)
router.post('/logout',authController.logout)
router.post('/reset-password', checkAuth(...Object.values(Role)), authController.resetPassword)

export const AuthRouter = router