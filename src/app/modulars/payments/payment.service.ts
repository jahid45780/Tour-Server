
import { BOOKING_STATUS } from "../booking/booking.interface"
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "./payment.interface"
import { Payment } from "./payment.model"

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
    successPayment,
    failPayment,
    cancelPayment
}