// import { Response } from "express";
// // import { envVers } from "../config/env";

// export interface authTokens {
//     accessToken?:string;
//     refreshToken?:string
// }

//  export const setAuthCookie = async (res:Response, tokenInfo:authTokens)=>{
   


// if(tokenInfo.accessToken){
//        res.cookie("AccessToken", tokenInfo.accessToken,{
//        httpOnly:true,
//        secure:true,
//    //  secure:envVers.NODE_ENV === "production",
//     sameSite:"none"

//    })
// }

// if(tokenInfo.refreshToken){

//       res.cookie("refreshToken", tokenInfo.refreshToken,{
//        httpOnly:true,
//        secure:true,
//    //  secure:envVers.NODE_ENV === "production",
//     sameSite:"none"
//    })

// }

// }



import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (
  res: Response,
  tokenInfo: AuthTokens,
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as
      | "none"
      | "lax",
    path: "/",
  };

  if (tokenInfo.accessToken) {
    res.cookie("AccessToken", tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
};
