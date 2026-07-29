import { Request, Response } from "express";
import { exchangeSetupCode } from "../services/google-calendar.js";

export async function setupGoogleCallback (req:Request, res:Response) {
    
    const code = req.query.code as string | undefined;

    if(!code) throw new Error('code is required');

    const {refreshToken,email} = await exchangeSetupCode(code)

    res.status(200).json({
        success: true,
        data: {
            refreshToken,
            email
        }
    })
};