
import express from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../auth/authCheck";
import { Role } from "../users/user.interface";

const router = express.Router()

router.post('/init-payment',paymentController.initPayment)
router.post('/success', paymentController.successPayment)
router.post('/fail', paymentController.failPayment)
router.post('/cancel', paymentController.cancelPayment)
router.get('invoice/:paymentId', checkAuth(...Object.values(Role)), paymentController.getInvoiceDownloadUrl)

export const paymentRouter = router