/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sentResponse } from "../../utils/sendResponse"
import  httpStatue  from "http-status-codes";
import { authService } from "./auth.service";

const credentialsLogin = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
    const loginInfo = await authService.credentialsLogin(req.body)

  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:"successfully logging user",
    data:loginInfo
   
  })

})

export const authController ={
    credentialsLogin
}