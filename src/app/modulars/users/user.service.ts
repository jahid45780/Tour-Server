
import { JwtPayload } from "jsonwebtoken";
import { envVers } from "../../config/env";
import AppError from "../../errorHerplrs/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcrypt";
import httpStatue  from 'http-status-codes';

const createUser = async (payload:Partial<IUser>)=>{

    const {email, password, ...rest} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(400, "already user exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVers.BCRYPT_SALT_ROUND))
    
    const authProvider:IAuthProvider ={provider:"credentials", providerID: email as string }
    
     const user = await User.create({
                 email ,
                 password:hashedPassword,
                 auths:[authProvider],
                ...rest
            })

            return user

}

const updateUser  = async (userId:string, payload:Partial<IUser>, decodedToken:JwtPayload)=>{
    
    const isUserExist = await User.findById(userId)

    if(!isUserExist){
        throw new AppError(httpStatue.NOT_FOUND,"User Not found")
    }
    
    if(payload.role){
            if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
                throw new AppError(httpStatue.FORBIDDEN,"you are not authorized")
            }
        }

        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
            throw new AppError(httpStatue.FORBIDDEN,"you are not authorized")
        }

        if(payload.IsActive, payload.IsDeleted, payload.IsVerified){
             if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
                throw new AppError(httpStatue.FORBIDDEN,"you are not authorized")
            }
        }

        if(payload.password){
            payload.password = await bcryptjs.hash(payload.password, envVers.BCRYPT_SALT_ROUND)
        }

        const newUpdateUser = await User.findByIdAndUpdate(userId, payload ,{new:true, runValidators:true} )

        return newUpdateUser
}

const getUsers = async ()=>{
    const users = await User.find({})

    const totalUsers = await User.countDocuments()

    return{
        data:users,
        meta:{
            total:totalUsers
        }

    }
}

export const userService = {
    createUser,
    getUsers,
    updateUser
}