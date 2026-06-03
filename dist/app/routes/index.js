"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modulars/users/user.route");
const auth_route_1 = require("../modulars/auth/auth.route");
const division_route_1 = require("../modulars/division/division.route");
const tour_route_1 = require("../modulars/tour/tour.route");
const booking_route_1 = require("../modulars/booking/booking.route");
const payment_route_1 = require("../modulars/payments/payment.route");
const otp_route_1 = require("../modulars/otp/otp.route");
const stats_route_1 = require("../modulars/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRouter = [
    {
        path: '/user',
        route: user_route_1.userRouter
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouter
    },
    {
        path: '/division',
        route: division_route_1.DivisionRoutes
    },
    {
        path: '/tour',
        route: tour_route_1.TourRoutes
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRouter
    },
    {
        path: '/otp',
        route: otp_route_1.OtpRoutes
    },
    {
        path: '/stats',
        route: stats_route_1.StatsRoutes
    }
];
moduleRouter.forEach((route) => {
    exports.router.use(route.path, route.route);
});
