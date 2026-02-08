/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sentResponse } from "../../utils/sendResponse"
import  httpStatue  from "http-status-codes";
import { authService } from "./auth.service";
import AppError from "../../errorHerplrs/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userTokens";
import { envVers } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  

      passport.authenticate( "local", async (err:any, user:any, info:any)=>{


        if(err){
         return next( new AppError (401, err) )
        }

        if(!user){
          // return next("user  does not exited")
          return next( new AppError (401, info.message) )
        }

    const userTokens = await createUserToken(user)

    const { password: pass, ...res } = user.toObject()

     

   setAuthCookie(res, userTokens)

  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:"successfully logging user",
    data:{
      accessTokens: userTokens.accessToken,
      refreshTokens: userTokens.refreshToken,
      user:res
    }
   
  })

      })(req,res,next)

  //  const loginInfo = await authService.credentialsLogin(req.body)

  //  setAuthCookie(res, loginInfo)

  // sentResponse(res,{
  //   success:true,
  //   statusCode:httpStatue.OK,
  //   message:"successfully logging user",
  //   data:loginInfo
   
  // })

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
 
  await authService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)
  
  sentResponse(res,{
    success:true,
    statusCode:httpStatue.OK,
    message:" password  reset successfully",
    data:null
   
  })
})

const googleCallbackController = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
  
  let redirectTo = req.query.state ? req.query.state as string : ""

  if(redirectTo.startsWith('/')){
   redirectTo = redirectTo.slice(1)
  }

  const user = req.user;
  if(!user){
    throw new AppError(httpStatue.NOT_FOUND,"user not found")
  }

  const TokenInfo = createUserToken(user)

  setAuthCookie(res, TokenInfo)

  res.redirect(`${envVers.FRONTEND_URL} / ${redirectTo}`)
  
 
})

export const authController ={
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}