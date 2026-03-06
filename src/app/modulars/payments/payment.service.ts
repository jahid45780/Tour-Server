/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errorHerplrs/appError"
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { SSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"
import  httpStatue  from 'http-status-codes';

const initPayment = async (bookingId:string)=>{

  const payment = await Payment.findOne({booking:bookingId})

  if(!payment){
    throw new AppError(httpStatue.NOT_FOUND,"payment not found, you have not booked this tour")
  }

  const booking = await Booking.findById(payment.booking)

 const userAddress = (booking?.user as any).address
     const userEmail = (booking?.user as any).email
     const userPhone = (booking?.user as any).phone
     const userName = (booking?.user as any).name
 
 
    const sslPayload: SSLCommerz = {
        
     address:userAddress,
     email:userEmail,
     phoneNumber:userPhone,
     name:userName,
     amount:payment.amount,
     transactionId:payment.transactionId
 
    }
 
    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return{
       paymentUrl:sslPayment.GatewayPageURL,
    }
 

}

const successPayment = async(query: Record<string, string>)=>{
      const session = await Booking.startSession()
      session.startTransaction()

      try {
        const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
            status: PAYMENT_STATUS.PAID
        },{new:true, runValidators:true, session })

       await Booking.findByIdAndUpdate(
              updatedPayment?.booking,
               { status: BOOKING_STATUS.COMPLETE},
               {new:true, runValidators:true, session }
           )

            await session.commitTransaction()
            session.endSession()
         return {success:true, message:"payment completed successfully"}

      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
}


const failPayment = async(query: Record<string, string>)=>{
      const session = await Booking.startSession()
      session.startTransaction()

      try {
        const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
            status: PAYMENT_STATUS.FAILED
        },{new:true, runValidators:true, session })

       await Booking.findByIdAndUpdate(
              updatedPayment?.booking,
               { status: BOOKING_STATUS.FAILED},
               { runValidators:true, session }
           )
            await session.commitTransaction()
            session.endSession()
         return {success:true, message:"payment failed"}

      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
}


const cancelPayment = async(query: Record<string, string>)=>{
      const session = await Booking.startSession()
      session.startTransaction()

      try {
        const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
            status: PAYMENT_STATUS.CANCELLED
        },{ runValidators:true, session })

       await Booking.findByIdAndUpdate(
              updatedPayment?.booking,
               { status: BOOKING_STATUS.CANCEL},
               { runValidators:true, session }
           )
            await session.commitTransaction()
            session.endSession()
         return {success:true, message:"payment canceled"}

      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
}

 export const paymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment
}