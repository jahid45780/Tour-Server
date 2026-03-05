/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHerplrs/appError";
import { Tour } from "../tour/tour.model";
import { User } from "../users/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import  httpStatue  from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payments/payment.model";
import { PAYMENT_STATUS } from "../payments/payment.interface";
import { SSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";



const getTransactionId = ()=>{
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000 )}`
}

const createBooking = async(payload:Partial<IBooking>, userId:string)=>{

  const transactionId = getTransactionId()

   const session = await Booking.startSession()
    session.startTransaction()

    try {

      const user = await User.findById(userId)

   if(!user?.phone || !user.address){
    throw new AppError(httpStatue.BAD_REQUEST, "Please Update Your Profile to Book a Tour")
   }

   const tour = await Tour.findById(payload.tour).select("costFrom")
   if(!tour?.costFrom){
    throw new AppError(httpStatue.BAD_REQUEST, "No Tour Cost Found!")
   }

   const amount = Number(tour.costFrom) * Number(payload.guestCount)

   const booking = await Booking.create([{
       user: userId,
       status: BOOKING_STATUS.PENDING,
       ...payload
   }],{session})

   const payment = await Payment.create([{
      booking:booking[0]._id,
      status:PAYMENT_STATUS.UNPAID,
      transactionId:transactionId,
      amount: amount
   }],{session})

   const updateBooking = await Booking.findByIdAndUpdate(
       booking[0]._id,
       { payment: payment[0]._id},
       {new:true, runValidators:true, session }
   ).populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment")

    const userAddress = (updateBooking?.user as any).address
    const userEmail = (updateBooking?.user as any).email
    const userPhone = (updateBooking?.user as any).phone
    const userName = (updateBooking?.user as any).name


   const sslPayload: SSLCommerz = {
       
    address:userAddress,
    email:userEmail,
    phoneNumber:userPhone,
    name:userName,
    amount:amount,
    transactionId:transactionId

   }

   const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    await session.commitTransaction()
    session.endSession()
   return {
    paymentUrl:sslPayment.GatewayPageURL,
    booking:updateBooking
   }
      
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throw error
    }
  }

  

export const BookingService = {
  createBooking
}