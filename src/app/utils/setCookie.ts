import { Response } from "express";

export interface authTokens {
    accessToken?:string;
    refreshToken?:string
}

 export const setAuthCookie = async (res:Response, tokenInfo:authTokens)=>{
   


if(tokenInfo.accessToken){
       res.cookie("AccessToken", tokenInfo.accessToken,{
       httpOnly:true,
       secure:false
   })
}

if(tokenInfo.refreshToken){

      res.cookie("refreshToken", tokenInfo.refreshToken,{
       httpOnly:true,
       secure:false
   })

}


}