

import { Response } from "express";
import { envVers } from "../config/env";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (
  res: Response,
  tokenInfo: AuthTokens
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: envVers.NODE_ENV === "production",
    sameSite: envVers.NODE_ENV === "production" ? "none" as const : "lax" as const,
    path: "/",
  };

  if (tokenInfo.accessToken) {
    res.cookie("AccessToken", tokenInfo.accessToken, {
      ...cookieOptions,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
    });
  }
};



