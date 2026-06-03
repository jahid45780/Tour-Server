"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authCheck_1 = require("./authCheck");
const user_interface_1 = require("../users/user.interface");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.credentialsLogin);
router.post('/refresh-token', auth_controller_1.authController.getNewAccessToken);
router.post('/logout', auth_controller_1.authController.logout);
router.post('/reset-password', (0, authCheck_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.resetPassword);
router.post('/change-password', (0, authCheck_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.changePassword);
router.post('/set-password', (0, authCheck_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.setPassword);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", (req, res, next) => {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect
    })(req, res, next);
});
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.authController.googleCallbackController);
exports.AuthRouter = router;
