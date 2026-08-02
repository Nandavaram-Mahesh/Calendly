import { google } from "googleapis";
import {GOOGLE_CALENDAR_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRETE, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN, GOOGLE_SENDER_EMAIL} from "../config/env.js";
import { findBookingById } from "../repositories/booking.repository.js";
import { BadRequestError } from "../utils/error.js";



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

export async function createGoogleCalendarEvent(bookingId: number){

    const booking = await findBookingById(bookingId);

    if(!booking || booking.status!=="CONFIRMED"){
        throw new BadRequestError('Booking not found or not confirmed');
    }

    const client = getGoogleCalendarClient();

    const calendar = await google.calendar({
        version: 'v3',
        auth: client
    });

    const event = await calendar.events.insert({
        calendarId: GOOGLE_CALENDAR_ID,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: {
            summary: `${booking.eventType.title} with ${booking.host.name} is confirmed`,
            description: [
                booking.eventType.description,
                booking.inviteeNotes ? `Invitee note: ${booking.inviteeNotes}` : '',
            ].join('\n\n'),
            start: {
                dateTime: booking.slot.startAt.toISOString(),
                timeZone: booking.host.timezone,
            },
            end: {
                dateTime: booking.slot.endAt.toISOString(),
                timeZone: booking.host.timezone,
            },
            attendees: [
                { email: booking.host.email, displayName: booking.host.name },
                { email: booking.inviteeEmail, displayName: booking.inviteeName },
            ],
            conferenceData: {
                createRequest: {
                    requestId: booking.id.toString(),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    }
                }
            }
        }
    });

    const meetLink = event.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ?? 
    event.data.hangoutLink ?? null;

    if(!event.data.id || !meetLink) {
        throw new Error('Failed to create Google Calendar event');
    }

    return {
        meetLink,
        calendarEventId: event.data.id,
    }

}
