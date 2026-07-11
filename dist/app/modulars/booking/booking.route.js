"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const authCheck_1 = require("../auth/authCheck");
const user_interface_1 = require("../users/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
router.post("/", (0, authCheck_1.checkAuth)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.validateRequest)(booking_validation_1.createBookingZodSchema), booking_controller_1.BookingController.createBooking);
exports.BookingRoutes = router;
