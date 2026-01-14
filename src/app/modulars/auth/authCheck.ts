/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHerplrs/appError";
import { verifyToken } from "../../utils/jwt";
import { envVers } from "../../config/env";


 export const checkAuth = ((...authRoles:string[]) => async (req:Request, res:Response, next:NextFunction)=>{
        try {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError(403, "Not received token")
    }

    // const verifiedToken = jwt.verify(accessToken,"SECRET")
    const verifiedToken  = verifyToken(accessToken, envVers.JWT_ACCESS_SECRET) as JwtPayload

     if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "you not permitted to view this  route")
    }
   
    
    next()
} catch (error) {
    next(error)
}
})