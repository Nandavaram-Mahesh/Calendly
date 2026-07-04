import { customAlphabet,nanoid } from "nanoid";

export function generateSlug(text:string){
    const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);
    
    const slug = text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "") // Remove quotes
    .replace(/[^a-z0-9\s]+/g, "") // Replace non-alphanumeric chars with ""
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/^-+|-+$/g, "") // Remove leading/trailing -
    .replace(/-+/g, "-"); // Collapse multiple -

    return `${slug}-${nanoid()}`
}

