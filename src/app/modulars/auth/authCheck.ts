
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHerplrs/appError";
import { verifyToken } from "../../utils/jwt";
import { envVers } from "../../config/env";
import { User } from "../users/user.model";
import { isActive } from "../users/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;

      const accessToken =
        req.cookies?.AccessToken ||
        (authorization?.startsWith("Bearer ")
          ? authorization.split(" ")[1]
          : authorization);

console.log("Cookie names:", Object.keys(req.cookies || {}));
console.log("Authorization:", !!req.headers.authorization);

      if (!accessToken) {
        throw new AppError(401, "Authentication token missing");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVers.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!verifiedToken?.email || !verifiedToken?.userId) {
        throw new AppError(401, "Invalid authentication token");
      }

      const user = await User.findOne({
        email: verifiedToken.email,
      });

      if (!user) {
        throw new AppError(401, "User does not exist");
      }

      if (
        user.IsActive === isActive.BLOCKED ||
        user.IsActive === isActive.INACTIVE
      ) {
        throw new AppError(403, `User is ${user.IsActive}`);
      }

      if (user.IsDeleted) {
        throw new AppError(403, "User is deleted");
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(String(verifiedToken.role))
      ) {
        throw new AppError(403, "You are not permitted to access this route");
      }

      req.user = verifiedToken;

      return next();
    } catch (error) {
      return next(error);
    }
  };
