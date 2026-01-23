/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sentResponse } from "../../utils/sendResponse"
import  httpStatue  from "http-status-codes";
import { authService } from "./auth.service";
import AppError from "../../errorHerplrs/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
   const loginInfo = await authService.credentialsLogin(req.body)

   setAuthCookie(res, loginInfo)

  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:"successfully logging user",
    data:loginInfo
   
  })

})


const getNewAccessToken = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
      throw new AppError(httpStatue.BAD_REQUEST,"not found refreshToken")
    }

    const TokenInfo = await authService.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, TokenInfo)


  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:"successfully  access token and refreshToken",
    data:TokenInfo
   
  })

})

const logout = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
  
   res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })

    res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
  
  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:"successfully  logged out user",
    data:null
   
  })
})


const resetPassword = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
  
  
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user;
 
  await authService.resetPassword(oldPassword, newPassword, decodedToken)
  
  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:" password  reset successfully",
    data:null
   
  })
})

export const authController ={
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}