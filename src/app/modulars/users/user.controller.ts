/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/sendResponse";





const createUser = catchAsync (async  (req:Request, res:Response, next:NextFunction)=>{
  const user  = await userService.createUser(req.body)

  //  res.status(httpStatus.CREATED).json({
  //         message:"successfully create user",
  //          user
  //       })

    sentResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"successfully create user",
      data:user

    })
  

})


// const createUser = async (req:Request, res:Response, next:NextFunction)=>{
//       try {

//         const user  = await userService.createUser(req.body)

    
//         res.status(httpStatus.CREATED).json({
//             message:"successfully create user",
//             user
//         })
        
//       } catch (err:any) {

//         console.log(err);
//         next(err)
        
//       }
// }

// const getUsers = async (req:Request, res:Response, next:NextFunction)=>{
//     try {
//       const users = await userService.getUsers
//       return users
//     } catch (err) {
//       console.log(err);
//       next(err)
//     }
// }

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




 export const userController = {
    createUser,
    getAllUsers
}