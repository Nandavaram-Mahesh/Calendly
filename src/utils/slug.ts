import { nanoid } from "nanoid";
export function generateUserSlug(){
    return nanoid(6);
}