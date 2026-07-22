/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { IUser } from "./user.interface";



const createUser = catchAsync (async  (req:Request, res:Response, next:NextFunction)=>{

     const payload :IUser={
          ...req.body,
          picture:req.file?.path
      }
  
  const user  = await userService.createUser(payload)

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
   
  })

})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userService.getSingleUser(id);
   sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data: result.data
    })
})


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await userService.getMe(decodedToken.userId);

    sentResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})


const updateUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
  const userId = req.params.id
  const verifiedToken = req.user
  // const token = req.headers.authorization
  // const verifiedToken = verifyToken(token as string, envVers.BCRYPT_SALT_ROUND) as JwtPayload
   const payload = req.body
   const user  =  await userService.updateUser(userId, payload, verifiedToken as JwtPayload )
  

  sentResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"successfully update users",
    data:user 
  })

})




const deleteUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  
  const {userId} = req.params;

  const result = await userService.deleteUser(
       req.params.userId,
       req.user!
  )
  

  sentResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"successfully delete users",
    data:result
  })

})


const changeUserRole = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  const { role } = req.body;

  const result = await userService.changeUserRoleIntoDB(
    id,
    role,
    req.user! 
  );

  sentResponse(res, {
    statusCode: 200,
    success: true,
    message: "Role updated successfully",
    data: result,
  });
});




 export const userController = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
    getMe,
    deleteUser,
    changeUserRole
}