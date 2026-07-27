import { regenerateHostSlots as runSlotGeneration, RegenerateHostSlotsInput } from "../../services/slot.service.js";

export async function regenerateHostSlotsActivity(input:RegenerateHostSlotsInput){
    await runSlotGeneration(input); 
}
