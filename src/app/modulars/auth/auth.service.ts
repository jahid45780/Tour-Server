/* eslint-disable @typescript-eslint/no-explicit-any */
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
import  httpStatus  from 'http-status-codes';
import jwt  from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail";

const credentialsLogin = async (payload:Partial<IUser>)=>{
     const {email, password} = payload;

     const isUserExist = await User.findOne({email})
     
         if(!isUserExist){
             throw new AppError(400, "email dose not  exist")
         }

           // VERIFY CHECK
  if (!isUserExist.IsVerified) {
    throw new AppError(401, "User is not verified");
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

const resetPassword = async (payload:Record<string, any>, decodedToken:JwtPayload) =>{

if(payload.id != decodedToken.userId){
   throw new AppError(401,"You can not reset your password")
}

const isUserExist = await User.findById(decodedToken.userId)

if(!isUserExist){
   throw new AppError(404, "user  not  found")
}

const hashedPassword = await bcryptjs.hash(
   payload.newPassword,
   Number(envVers.BCRYPT_SALT_ROUND)
)
isUserExist.password= hashedPassword
 await isUserExist.save()
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


const forgotPassword = async (email:string) =>{

   const isUserExist = await User.findOne({email});


     if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.IsVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.IsActive === isActive.BLOCKED || isUserExist.IsActive === isActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.IsActive}`)
    }
    if (isUserExist.IsDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

  const jwtPayload = {
    userId: isUserExist._id,
    email:isUserExist.email,
    role:isUserExist.role
  }

  const resetToken = jwt.sign(jwtPayload, envVers.JWT_ACCESS_SECRET,{
   expiresIn:"10m"
  })

   const resetUILink = `${envVers.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

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
   resetPassword,
   forgotPassword
}