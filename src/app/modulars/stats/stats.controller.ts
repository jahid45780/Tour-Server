import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sentResponse } from "../../utils/sendResponse";


const getUserStats = catchAsync(async (req:Request, res:Response)=>{
    const stats = await StatsService.getUserStats()

      sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });

})

  const getTourStats = catchAsync(async (req:Request, res:Response)=>{
        
        const stats = await StatsService.getTourStats()

          sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
        
    })

    const getBookingStats = catchAsync(async (req:Request, res:Response)=>{
      const stats = await StatsService.getBookingStats()

      sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "booking stats fetched successfully",
        data: stats,
    });

    })

    const getPaymentStats = catchAsync(async(req:Request, res:Response)=>{
         const stats = await StatsService.getPaymentStats()

          sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "payment stats fetched successfully",
        data: stats,
    });

    })

export const  StatsController = {
    getUserStats,
   getTourStats,
   getBookingStats,
   getPaymentStats
}