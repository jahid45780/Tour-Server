/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */


import nodemailer from "nodemailer";
import { envVers } from "../config/env";
import AppError from "../errorHerplrs/appError";
import path from "path";
import ejs from "ejs";

const transporter= nodemailer.createTransport({
   secure:true,
    auth:{
        user:envVers.EMAIL_SENDER.SMTP_USER,
        pass:envVers.EMAIL_SENDER.SMTP_PASS
    },
    port:Number(envVers.EMAIL_SENDER.SMTP_PORT),
    host:envVers.EMAIL_SENDER.SMTP_HOST
})

interface SendEmailOptions {
    to:string,
    subject:string,
    templateName:string,
    templateData?: Record<string, any>,
     attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}:SendEmailOptions)=>{
    try {
    const templatePath = path.join(__dirname,`templates/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)
    const info = await transporter.sendMail({
        from:envVers.EMAIL_SENDER.SMTP_FROM,
        to:to,
        subject:subject,
        html:html,
        attachments:attachments?.map(attachments=>({
            filename:attachments.filename,
            content:attachments.content,
            contentType:attachments.contentType
        }))
    })
     console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);   
    } catch (error:any) {
        console.log("email sending error", error.message);
        throw new AppError(401, "Email error")
    }
}


