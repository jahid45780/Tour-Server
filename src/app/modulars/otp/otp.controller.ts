import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sentResponse } from "../../utils/sendResponse";
import { OTPService } from "./opt.service";


const sendOTP = catchAsync(async(req:Request, res:Response)=>{
    
    const {email, name} = req.body;

    await OTPService.sendOTP(email, name)

    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
})

export const OTPController = {
    sendOTP
}