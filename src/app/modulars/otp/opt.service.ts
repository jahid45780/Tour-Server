/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from "crypto";
import { User } from "../users/user.model";
import AppError from "../../errorHerplrs/appError";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const OTP_EXPIRATION = 2 * 60

const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()


    return otp
}

const sendOTP = async (email:string, name:string)=>{
    const user = await User.findOne({email})
    if (!user){
        throw new AppError(404, "User Not  Found")
    }

    if(user.IsVerified){
        throw new AppError(401, "You are already verified")
    }

    const otp = generateOtp()

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey,otp,{
        expiration:{
            type:"EX",
            value:OTP_EXPIRATION
        }
    })

    await sendEmail({
        to:email,
        subject:"Your OTP Code",
        templateName:"otp",
        templateData:{
            name:name,
            otp:otp
        }
    })

}

export const OTPService ={
    sendOTP
}