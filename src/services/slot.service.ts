import { DateTime } from "luxon";
import { findActiveEventTypesByHost, findActiveRuleByHost, findUserById } from "../repositories/index.js";
import { NotFoundError } from "../utils/error.js";
import { findBookedSlotsByHostInRange } from "../repositories/slot.repository.js";
import { findExceptionsByUserInRange } from "../repositories/availability.repository.js";
import { applyExceptionsForDate, TimeWindow, windowsForWeekdayRule } from "./slot-generation.service.js";


interface RegenerateHostSlotsInput{
    hostId:number,
    from?:string, // YYYY-MM-DD
    to?:string    // YYYY-MM-DD
}
export async function regenerateHostSlots(input:RegenerateHostSlotsInput){
    
    const user = await findUserById(input.hostId)

    if(!user) throw new NotFoundError('User not found');


    // Convert from and to to dates using luxon , so that we can perform som operation on it (ex:plus,minus...)
    const from =input.from ? DateTime.fromISO(input.from,{zone:'UTC'}).startOf('day'):DateTime.now().startOf('day'); //  2026-06-01 -> 2026-06-01T00:00:00:000Z
    const to = input.to ? DateTime.fromISO(input.to,{zone:'UTC'}).endOf('day'):DateTime.now().endOf('day');         //   2026-06-01 -> 2026-06-01T23:59:59:999Z

    // Fetch all the rules, exceptions , eventtypes , bookedslots of a user



    const[rules, exceptions, eventTypes, bookedSlots] = await Promise.all([
        findActiveRuleByHost(input.hostId),
        findExceptionsByUserInRange(input.hostId,from.toJSDate(),to.toJSDate()),     // toJsDate converts DateTime to Date , so that prisma understands it
        findActiveEventTypesByHost(input.hostId),
        findBookedSlotsByHostInRange(input.hostId,from.toJSDate(),to.toJSDate())
    ]);

    const bookedWindows = bookedSlots.map(slot=>{
        return {
            start: DateTime.fromJSDate(slot.startAt, { zone: 'utc' }),   // after getting the results from db , the startAt and endAt are Date type , so we need to convert it to DateTime to perform some operations on it
            end: DateTime.fromJSDate(slot.endAt, { zone: 'utc' }),
        }
    })


    for(const eventType of eventTypes){ 
        for(let cursor = from;cursor<=to;cursor=cursor.plus({days:1})){
            
            const dateKey = cursor.toISODate(); // 2026-06-01
            
            const dayExceptions = exceptions.filter(ex=>DateTime.fromJSDate(ex.date).toISODate() === dateKey); // we are converting the js Date to luxon so that we can convert it to ISODate easily
            
            const dayExceptionsWithTimeZone = dayExceptions.map((ex) => ({
                type: ex.type,
                startTime: ex.startTime,
                endTime: ex.endTime,
                timeZone: ex.timezone,
            }));

            let windows: TimeWindow[] = [];
            
            // convert rules into time windows -> compatible with luxon

            for(const rule of rules){
                
                windows.push(...windowsForWeekdayRule(cursor,rule.weekday,rule.startTime,rule.endTime,rule.timezone));
            }
        
            windows = applyExceptionsForDate(cursor,windows,dayExceptionsWithTimeZone);

        }
    }



}