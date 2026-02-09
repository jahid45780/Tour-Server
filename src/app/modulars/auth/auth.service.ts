/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";
import AppError from "../../errorHerplrs/appError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens";
import { isActive, IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import bcrypt from "bcrypt";
import  bcryptjs  from 'bcrypt';
import httpStatue  from 'http-status-codes';

const credentialsLogin = async (payload:Partial<IUser>)=>{
     const {email, password} = payload;

     const isUserExist = await User.findOne({email})
     
         if(!isUserExist){
             throw new AppError(400, "email dose not  exist")
         }

   const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string )
   
   if(!isPasswordMatched){
    throw new AppError(400, " incorrect password")
   }

   const {password:pass, ...res} = isUserExist.toObject()

   const userTokens = createUserToken(isUserExist)

     delete isUserExist.password

   return {
    accessToken:userTokens.accessToken,
    refreshToken:userTokens.refreshToken,
    user:res
   }
}


const getNewAccessToken = async (refreshToken:string)=>{

   const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    

   return {
    accessToken:newAccessToken
   }
}

const resetPassword = async (oldPassword:string, newPassword: string, decodedToken:JwtPayload) =>{


 const user = await User.findById(decodedToken.userId)
 
const isOldPasswordMatch = await  bcryptjs.compare(oldPassword, user!.password as string)

if(!isOldPasswordMatch){
   throw new AppError(httpStatue.UNAUTHORIZED, "old  password  does  not match")

}
    
user!.password = await bcryptjs.hash(newPassword, Number(envVers.BCRYPT_SALT_ROUND))
await user!.save()


}

export const authService ={
   credentialsLogin,
   getNewAccessToken,
   resetPassword
}