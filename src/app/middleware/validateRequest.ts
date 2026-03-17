// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject } from "zod";

//  export const validateRequest = (zodSchema:AnyZodObject)=> async  (req:Request, res:Response, next:NextFunction) =>{
//     try {
//         req.body = JSON.parse(req.body.data) || req.body
//         req.body = await zodSchema.parseAsync(req.body)
//         next()
//     } catch (error) {
//          next(error)
//     }
// }

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let parsedBody;

      // 🔥 safe check
      if (req.body?.data) {
        parsedBody = JSON.parse(req.body.data);
      } else {
        parsedBody = req.body;
      }

      // validate with zod
      const validatedData = await zodSchema.parseAsync(parsedBody);

      req.body = validatedData;

      next();
    } catch (error) {
      next(error);
    }
  };