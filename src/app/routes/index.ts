import { Router } from "express";
import { userRouter } from "../modulars/users/user.route";
import { AuthRouter } from "../modulars/auth/auth.route";
import { DivisionRoutes } from "../modulars/division/division.route";



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
    }
    
 ]

 moduleRouter.forEach((route)=>{
    router.use(route.path, route.route)
 })