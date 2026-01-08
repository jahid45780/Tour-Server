import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";
import  jwt, { JwtPayload }  from 'jsonwebtoken';
import AppError from "../../errorHerplrs/appError";




const router = Router()

router.post('/register', validateRequest(createUserZodSchema), userController.createUser)

router.get('/all-users', async (req:Request, res:Response, next:NextFunction)=>{
      
    
try {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError(403, "Not received token")
    }

    const verifiedToken = jwt.verify(accessToken,"SECRET")

    if(!verifiedToken){
         throw new AppError(403, " Your  Not authorization")
    }

    if((verifiedToken as JwtPayload).role !=="ADMIN"){
         throw new AppError(403, "you not permitted to view this  route")
    }
    
    next()
} catch (error) {
    next(error)
}


}, userController.getAllUsers )

 export const userRouter = router;