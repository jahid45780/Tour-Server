import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVers } from "../../config/env";

const successPayment = catchAsync( async (req:Request, res:Response)=>{
    const query = req.query
    const result = await paymentService.successPayment(query as Record<string, string> )
    if(result.success){
        res.redirect(`${envVers.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

const failPayment = catchAsync( async (req:Request, res:Response)=>{
    const query = req.query
    const result = await paymentService.successPayment(query as Record<string, string> )
    if(!result.success){
        res.redirect(`${envVers.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

const cancelPayment = catchAsync( async (req:Request, res:Response)=>{
    const query = req.query
    const result = await paymentService.successPayment(query as Record<string, string> )
    if(!result.success){
        res.redirect(`${envVers.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

export const paymentController = {
    successPayment,
    failPayment,
    cancelPayment
}