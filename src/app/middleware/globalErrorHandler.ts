/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVers } from "../config/env";
import AppError from "../errorHerplrs/appError";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err:any, req:Request, res:Response, next:NextFunction)=>{


    let statusCode = 500;
    let message = 'something went wrong'

    const errorSources: { path: string; message: string }[] = [];

   if(err.code === 11000){
      const matchedArray = err.message.match(/"([^"]*)"/);
      statusCode = 400;
      message =`${matchedArray[1]} already existed!! `
   }

   else if(err.name === "ZodError"){
      statusCode = 400;
      message = "Zod Error"
    err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
   }

   else if(err.name === "CastError"){
    statusCode = 400
    message = "Invalid  mongoDB objectID  please provided valid id"
   }

  else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message

    } else if(err instanceof Error){
        statusCode = 500;
        message = err.message

    }

    res.status(statusCode).json({
        success:false,
        message,
        err,
        stack:envVers.NODE_ENV === "development" ? err.stack : null
    })

}