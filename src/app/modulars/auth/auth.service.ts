import AppError from "../../errorHerplrs/appError";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

   const accessToken =jwt.sign(jwtPayload, "SECRET",{
    expiresIn:"1d"
   })

   return {
    accessToken
   }
}

export const authService ={
   credentialsLogin
}