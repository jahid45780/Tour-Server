import { Router } from "express";
import { userRouter } from "../modulars/users/user.route";
import { AuthRouter } from "../modulars/auth/auth.route";
import { DivisionRoutes } from "../modulars/division/division.route";
import { TourRoutes } from "../modulars/tour/tour.route";
import { BookingRoutes } from "../modulars/booking/booking.route";
import { paymentRouter } from "../modulars/payments/payment.route";



 export const router = Router()

 const  moduleRouter = [
    {
        path:'/user',
        route:userRouter
    },
    {
      path:'/auth',
      route:AuthRouter
    },
    {
      path:'/division',
      route:DivisionRoutes
    },
    {
      path:'/tour',
      route:TourRoutes
    },
    {
      path:'/booking',
      route:BookingRoutes
    },
    {
      path:'/payment',
      route:paymentRouter
    }
    
 ]

 moduleRouter.forEach((route)=>{
    router.use(route.path, route.route)
 })