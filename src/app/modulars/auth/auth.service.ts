import { envVers } from "../../config/env";
import AppError from "../../errorHerplrs/appError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import bcrypt from "bcrypt";

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

   const jwtPayload = {
      userId:isUserExist._id,
      email:isUserExist.email,
      role:isUserExist.role
   }

   const accessToken = generateToken(jwtPayload, envVers.JWT_ACCESS_SECRET, envVers.JWT_ACCESS_EXPIRES)



   return {
    accessToken
   }
}

export const authService ={
   credentialsLogin
}