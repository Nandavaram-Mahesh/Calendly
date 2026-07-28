import nodemailer  from "nodemailer";
import { EMAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "./env.js";


let transporter:nodemailer.Transporter|null = null;

async function getTransporter(){

    if(transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: SMTP_USER && SMTP_PASS ? {
            user: SMTP_USER,
            pass: SMTP_PASS,
        }:undefined ,
    });


    return transporter;
}


export async function sendEmail(to:string,subject:string,html:string){
    
    const transporter = await getTransporter()

    const info = await transporter.sendMail({
        from: EMAIL_FROM, // sender address
        to, // list of recipients
        subject, // subject line
        html, 
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}



