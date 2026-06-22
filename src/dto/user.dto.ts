import {z} from 'zod';

const createUserSchema = z.object({
    email:z.email(),
    password:z.string().min(6)
})

type createUserDTO = z.infer<typeof createUserSchema>;

export { createUserSchema, createUserDTO };