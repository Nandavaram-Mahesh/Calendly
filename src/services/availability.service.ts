import { CreateAvailabilityExceptionDto, CreateAvailabilityRuleDto, UpdateAvailabilityExceptionDto, UpdateAvailabilityRuleDto } from "../dtos/index.js";
import { findUserById,createException, createRule, findActiveRuleByHost, findExceptionByHost, findExceptionById, findRuleByHostId, findRuleByHostIdAndWeekday, findRuleById, removeException, removeRule, updateException, updateRule } from "../repositories/index.js";
import { BadRequestError } from "../utils/index.js";

async function getRulesByHost(hostId:number){
    const availabilityRule = await findRuleByHostId(hostId);
    return availabilityRule;
}

async function getRuleById(id:number){
    const availabilityRule = await findRuleById(id);
    return availabilityRule;
}

async function getRuleByHostAndWeekday(hostId:number,weekday:number){
    const availabilityRule = await findRuleByHostIdAndWeekday(hostId,weekday);
    return availabilityRule;
}

async function getActiveRuleByHost(hostId:number){
    const availabilityRule = await findActiveRuleByHost(hostId);
    return availabilityRule;
}

async function createAvailabilityRule(hostId:number,data:CreateAvailabilityRuleDto){
    const user = await findUserById(hostId)

    if(!user) throw new BadRequestError('Host not found');

    return createRule(hostId,data);
    
}

async function updateAvailabilityRule(hostId:number,ruleId:number,data:UpdateAvailabilityRuleDto){    
    
    const availabilityRule = await findRuleById(hostId)
    if(!availabilityRule) throw new BadRequestError('Availability rule not found');

    if(availabilityRule.userId !== hostId) throw new BadRequestError('You are not authorized to update this availability rule');
    
    return updateRule(ruleId,data);    
}


async function deleteAvailabilityRule(hostId:number,ruleId:number){    
    const availabilityRule = await findRuleById(hostId);
    if(!availabilityRule) throw new BadRequestError('Availability rule not found');    
    if(availabilityRule.userId !== hostId) throw new BadRequestError('You are not authorized to delete this availability rule');    
    return removeRule(ruleId);    
}

// Exceptions
async function getExceptionsByHost(hostId:number){    
    const exceptions = await findExceptionByHost(hostId);    
    return exceptions;
}

async function getExceptionById(exceptionId:number){
    const exception = await findExceptionById(exceptionId);    
    return exception;
}

async function createAvailabilityException(hostId:number,data:CreateAvailabilityExceptionDto){    
    return createException(hostId,data);    
}

async function updateAvailabilityException(hostId:number,exceptionId:number,data:UpdateAvailabilityExceptionDto){
    const exception = await findExceptionById(exceptionId);

    if(!exception) throw new BadRequestError('Availability exception not found');    
    if(exception.userId !== hostId) throw new BadRequestError('You are not authorized to update this availability exception');    
    
    return updateException(exceptionId,data);
}

async function deleteAvailabilityException(hostId:number,exceptionId:number){    
    const exception = await findExceptionById(exceptionId);    
    if(!exception) throw new BadRequestError('Availability exception not found');    
    if(exception.userId !== hostId) throw new BadRequestError('You are not authorized to delete this availability exception');    
    return removeException(exceptionId);    
}


export {
    getRulesByHost,
    getRuleById,
    getRuleByHostAndWeekday,
    getActiveRuleByHost,
    createAvailabilityRule,
    updateAvailabilityRule,
    deleteAvailabilityRule,
    getExceptionsByHost,
    getExceptionById,
    createAvailabilityException,
    updateAvailabilityException,
    deleteAvailabilityException};