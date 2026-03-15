/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";
import AppError from "../../errorHerplrs/appError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens";
import { IAuthProvider, isActive, IUser } from "../users/user.interface";
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


return{}


}


const setPassword = async (userId:string, plainPassword:string) =>{

   const user = await User.findById(userId);

   if(!user){
      throw new AppError(httpStatue.NOT_FOUND, "user  not  found")
   }

   if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
      throw new  AppError(httpStatue.BAD_REQUEST,"you have already set password, Now  you Your Profile and changed the password")
   }

   const hashedPassword  = await bcryptjs.hash(
      plainPassword,
      Number(envVers.BCRYPT_SALT_ROUND)
   )

   const credentialProvider: IAuthProvider={
      provider:"credentials",
      providerID:user.email
   }

   const auths:IAuthProvider[] =[...user.auths, credentialProvider]
   user.password =hashedPassword;
   user.auths = auths;

   await user.save()

return{}


}


const changePassword = async (oldPassword:string, newPassword: string, decodedToken:JwtPayload) =>{


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
   setPassword,
   changePassword,
   resetPassword
}