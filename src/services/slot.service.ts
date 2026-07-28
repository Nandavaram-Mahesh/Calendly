import { DateTime } from "luxon";
import { findActiveEventTypesByHost, findActiveRuleByHost, findUserById } from "../repositories/index.js";
import { NotFoundError } from "../utils/error.js";
import { blockSlot, findBookedSlotsByHostInRange, findFutureSlotsByEventTypeInRange, upsertAvailableSlot } from "../repositories/slot.repository.js";
import { findExceptionsByUserInRange } from "../repositories/availability.repository.js";
import { applyExceptionsForDate, overlapsBooked, splitIntoSlots, TimeWindow, windowsForWeekdayRule } from "./slot-generation.service.js";
import { AppConfig } from "../config/index.js";

export interface RegenerateHostSlotsInput{
    hostId:number,
    from?:string, // YYYY-MM-DD
    to?:string    // YYYY-MM-DD
}
export async function regenerateHostSlots(input:RegenerateHostSlotsInput){
    
    const user = await findUserById(input.hostId)

    if(!user) return;


    // Convert from and to to dates using luxon , so that we can perform som operation on it (ex:plus,minus...)
    const from = input.from ? DateTime.fromISO(input.from,{zone:'utc'}).startOf('day'):DateTime.now().startOf('day').toUTC(); //  2026-06-01 -> 2026-06-01T00:00:00:000Z
    const to = input.to ? DateTime.fromISO(input.to,{zone:'utc'}).endOf('day'):from.plus({days:AppConfig.get('SLOT_GENERATION_DAYS')}).toUTC();         //   2026-06-01 -> 2026-06-01T23:59:59:999Z

    // Fetch all the rules, exceptions , eventtypes , bookedslots of a user
    const[rules, exceptions, eventTypes, bookedSlots] = await Promise.all([
        findActiveRuleByHost(input.hostId),
        findExceptionsByUserInRange(input.hostId,from.toJSDate(),to.toJSDate()),     // toJsDate converts luxon DateTime to Js Date , so that prisma understands it
        findActiveEventTypesByHost(input.hostId),
        findBookedSlotsByHostInRange(input.hostId,from.toJSDate(),to.toJSDate())
    ]);

    const bookedWindows = bookedSlots.map(slot=>{
        return {
            start: DateTime.fromJSDate(slot.startAt, { zone: 'utc' }),   // after getting the results from db , the startAt and endAt are Date type , so we need to convert it to luxon DateTime to perform some operations on it
            end: DateTime.fromJSDate(slot.endAt, { zone: 'utc' }),
        }
    })


    for(const eventType of eventTypes){ 

        const generatedValidSlotKeys = new Set<string>();

        for(let cursor = from;cursor<=to;cursor=cursor.plus({days:1})){
            
            const dateKey = cursor.toISODate(); // 2026-06-01
            
            const dayExceptions = exceptions.filter(ex=>DateTime.fromJSDate(ex.date,{ zone: 'utc'}).toISODate() === dateKey); // we are converting the js Date to luxon so that we can convert it to ISODate easily
            
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

            // Split windows into slots
            const slots = splitIntoSlots(
                windows,
                eventType.durationMinutes,
                eventType.bufferBeforeMinutes,
                eventType.bufferAfterMinutes
            ).filter(
                (slot)=>slot.start>DateTime.utc() && !overlapsBooked(slot,bookedWindows,eventType.bufferBeforeMinutes,eventType.bufferAfterMinutes)
            ); // filter out slots that are in the past or overlap with a booked slot

             
            for (const slot of slots){
                
                const startAt = slot.start.toUTC().toJSDate();
                const endAt = slot.end.toUTC().toJSDate();
                
                const key = `${eventType.id}|${startAt.toISOString()}|${endAt.toISOString()}`
                
                generatedValidSlotKeys.add(key)
                
                await upsertAvailableSlot(user.id,startAt,endAt,eventType.id);
                
            }

        }

        const futureSlots = await findFutureSlotsByEventTypeInRange(
            eventType.id,
            from.toJSDate(),
            to.toJSDate(),
        );

        for(const slot of futureSlots){
            const key = `${eventType.id}|${slot.startAt.toISOString()}|${slot.endAt.toISOString()}`

            if(!generatedValidSlotKeys.has(key)){
                await blockSlot(slot.id);
            }
        }
    }

}

// invalidSlots = All slots in db - new slots