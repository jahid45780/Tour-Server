import express from "express";
import { OTPController } from "./otp.controller";

const router = express.Router();

router.post("/send", OTPController.sendOTP)

export const  OtpRoutes = router;