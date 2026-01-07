
import AppError from "../../errorHerplrs/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcrypt";

const createUser = async (payload:Partial<IUser>)=>{

    const {email, password, ...rest} = payload;

    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new AppError(400, "already user exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, 10)
    
    const authProvider:IAuthProvider ={provider:"credentials", providerID: email as string }
    
     const user = await User.create({
                 email ,
                 password:hashedPassword,
                 auths:[authProvider],
                ...rest
            })

            return user

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
    getUsers
}