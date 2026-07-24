/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingService } from "./myBookings.service";
import { sentResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";


 const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const userId = (req.user as JwtPayload & { userId: string }).userId;

    const result = await BookingService.getMyBookings(userId);

    sentResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My bookings retrieved successfully",
      data: result,
    });
  }
);

export const BookingController = {
  getMyBookings,
};