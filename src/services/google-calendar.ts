import { google } from "googleapis";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRETE, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN, GOOGLE_SENDER_EMAIL} from "../config/env.js";



const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
];

export function isProjectCalendarConfigured(){
      
    return Boolean(
        GOOGLE_CLIENT_ID &&
        GOOGLE_CLIENT_SECRETE &&
        GOOGLE_REDIRECT_URI
    );
}



// This fn returns a google auth client ,using which we can communicate with google server
function getGoogleOauthClient() : InstanceType<typeof google.auth.OAuth2>{   
    
    console.log(`isProjectCalendarConfigured: ${isProjectCalendarConfigured()}`);
    
    if(!isProjectCalendarConfigured()){
        throw new Error("Google Calendar is not configured");
    }

    return new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRETE,
        GOOGLE_REDIRECT_URI
    );
}

// This fn returns us a authentication url , using which can grant google calendar access to this application , it will call our callback api and sends a code 
export function getSetupAuthUrl(){
    
    const oauthClient = getGoogleOauthClient();

    return oauthClient.generateAuthUrl({
        access_type:"offline",
        prompt: 'consent',
        scope:SCOPES,
        state:"setup"
    });
}


// This fn exchanges the setup code to get access and refresh tokens
export async function exchangeSetupCode(code:string){

    const client = getGoogleOauthClient();

    const {tokens} = await client.getToken(code);

    if(!tokens.refresh_token) throw new Error("No refresh token found");

    client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        version: 'v2',
        auth: client
    }); // using this oauth2 object we can get the user's info

    const {data} = await oauth2.userinfo.get();

    return {
        refreshToken:tokens.refresh_token,
        email:data.email ?? GOOGLE_SENDER_EMAIL
    }

}


export function getGoogleCalendarClient(): InstanceType<typeof google.auth.OAuth2> {
    if(!isProjectCalendarConfigured()) {
        throw new Error('Google project calendar is not configured');
    }

    const client = getGoogleOauthClient();

    client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN // this should be ideally brought from redis
    });

    return client;
}



