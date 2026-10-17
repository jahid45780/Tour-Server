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
  tokenInfo: AuthTokens
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
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




