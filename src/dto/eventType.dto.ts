import {z} from 'zod';

const createEventTypeSchema = z.object({
    hostId:z.number(),
    title:z.string(),
    description:z.string().optional(),
    durationMinutes:z.number(),
    isActive:z.boolean().default(true),
    locationType:z.string().default('ONLINE'),
    locationValue:z.string().optional(),
    bufferBeforeMinutes:z.number()
})

const updateEventTypeSchema = z.object({
    hostId:z.number().optional(),
    title:z.string().optional(),
    description:z.string().optional(),
    durationMinutes:z.number().optional(),
    isActive:z.boolean().optional(),
    locationType:z.string().optional(),
    locationValue:z.string().optional(),
    bufferBeforeMinutes:z.number().optional()
})


type CreateEventTypeDTO = z.infer<typeof createEventTypeSchema>
type UpdateEventTypeDTO = z.infer<typeof updateEventTypeSchema>

export {createEventTypeSchema,CreateEventTypeDTO,updateEventTypeSchema,UpdateEventTypeDTO};