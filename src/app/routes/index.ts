import { Router } from "express";
import { userRouter } from "../modulars/users/user.route";
import { AuthRouter } from "../modulars/auth/auth.route";


 export const router = Router()

 const  moduleRouter = [
    {
        path:'/user',
        route:userRouter
    },
    {
      path:'/auth',
      route:AuthRouter
    }
   
 ]

 moduleRouter.forEach((route)=>{
    router.use(route.path, route.route)
 })