"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const authCheck_1 = require("../auth/authCheck");
const user_interface_1 = require("../users/user.interface");
const router = express_1.default.Router();
router.post('/init-payment', payment_controller_1.paymentController.initPayment);
router.post('/success', payment_controller_1.paymentController.successPayment);
router.post('/fail', payment_controller_1.paymentController.failPayment);
router.post('/cancel', payment_controller_1.paymentController.cancelPayment);
router.get('/invoice/:paymentId', (0, authCheck_1.checkAuth)(...Object.values(user_interface_1.Role)), payment_controller_1.paymentController.getInvoiceDownloadUrl);
router.post("/validate-payment", payment_controller_1.paymentController.validatePayment);
exports.paymentRouter = router;
