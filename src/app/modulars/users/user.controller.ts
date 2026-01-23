/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVers } from "../../config/env";
import { JwtPayload } from 'jsonwebtoken';






const createUser = catchAsync (async  (req:Request, res:Response, next:NextFunction)=>{
  const user  = await userService.createUser(req.body)



    sentResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"successfully create user",
      data:user

    })
  

})


const getAllUsers = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const result = await userService.getUsers()

  sentResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"successfully get all-users",
    data:result.data,
    meta:result.meta
  })

})

const updateUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
  const userId = req.params.id
  const verifiedToken = req.user
  // const token = req.headers.authorization
  // const verifiedToken = verifyToken(token as string, envVers.BCRYPT_SALT_ROUND) as JwtPayload
   const payload = req.body
   const user  =  await userService.updateUser(userId, payload, verifiedToken)
  

  sentResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"successfully update users",
    data:user 
  })

})




 export const userController = {
    createUser,
    getAllUsers,
    updateUser
}