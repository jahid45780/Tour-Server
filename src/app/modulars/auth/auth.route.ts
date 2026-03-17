import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "./authCheck";
import { Role } from "../users/user.interface";
import passport from "passport";

const router = Router()

router.post('/login',authController.credentialsLogin)
router.post('/refresh-token',authController.getNewAccessToken)
router.post('/logout',authController.logout)
router.post('/reset-password', checkAuth(...Object.values(Role)), authController.resetPassword)
router.post('/change-password', checkAuth(...Object.values(Role)), authController.changePassword)
router.post('/set-password', checkAuth(...Object.values(Role)), authController.setPassword)
router.post('/forgot-password', authController.forgotPassword)
// eslint-disable-next-line @typescript-eslint/no-unused-vars

router.get("/google", (req: Request, res: Response, next: NextFunction) => {

  const redirect = req.query.redirect || "/"

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string
  })(req, res, next)

})

router.get("/google/callback", passport.authenticate("google", {failureRedirect:"/login"}),  authController.googleCallbackController)



export const AuthRouter = router