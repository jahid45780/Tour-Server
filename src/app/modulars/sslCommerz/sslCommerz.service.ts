import { envVers } from "../../config/env";
import AppError from "../../errorHerplrs/appError";
import { SSLCommerz } from "./sslCommerz.interface";
import axios from "axios"
import  httpStatue  from 'http-status-codes';

const sslPaymentInit = async(payload:SSLCommerz)=>{

   try {
     const data = {
            store_id:envVers.SSL.SSL_STORE_ID,
            store_passwd:envVers.SSL.SSL_STORE_PASS,
            total_amount:payload.amount,
            currency: "BDT",
            tran_id:payload.transactionId,
            success_url:`${envVers.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${envVers.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url:`${envVers.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            // ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name:payload.name,
            cus_email:payload.email,
            cus_add1:payload.address,
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone:payload.phoneNumber,
            cus_fax: "01763943446",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode:"23467",
            ship_country: "N/A",
    }

    const  response = await axios({
        method: "POST",
        url: envVers.SSL.SSL_PAYMENT_API,
        data: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })

    return response.data

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error:any) {
    console.log("Payment Error Occured", error);
    throw new AppError(httpStatue.BAD_REQUEST, error.message)
   }
}

export const SSLService = {
    sslPaymentInit
}