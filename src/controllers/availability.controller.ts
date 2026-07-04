import { Request, Response } from "express";

import { HTTPStatusCodes, sendSuccess } from "../utils/index.js";
import { getRulesByHost,createAvailabilityRule, updateAvailabilityRule, deleteAvailabilityRule, getExceptionsByHost, createAvailabilityException, updateAvailabilityException, deleteAvailabilityException } from "../services/index.js";

export async function fetchRules(req: Request, res: Response) {
    const rules = await getRulesByHost(req.userId);
    sendSuccess(res, rules);
}

export async function createRule(req: Request, res: Response) {
    const rule = await createAvailabilityRule(req.userId, req.body);
    sendSuccess(res, rule, HTTPStatusCodes.CREATED, "Availability rule created successfully");
}


export async function updateRule(req: Request, res: Response) {
    const { id } = req.params;
    const rule = await updateAvailabilityRule(req.userId, Number(id), req.body);
    sendSuccess(res, rule, HTTPStatusCodes.OK, "Availability rule updated successfully");
}

export async function removeRule(req: Request, res: Response) {
    const { id } = req.params;
    await deleteAvailabilityRule(req.userId, Number(id));
    sendSuccess(res, null, HTTPStatusCodes.OK, "Availability rule deleted successfully");
}

export async function fetchExceptions(req: Request, res: Response) {
    const exceptions = await getExceptionsByHost(req.userId);
    sendSuccess(res, exceptions);
}

export async function createException(req: Request, res: Response) {
    const exception = await createAvailabilityException(req.userId, req.body);
    sendSuccess(res, exception, HTTPStatusCodes.CREATED, "Availability exception created successfully");
}

export async function updateException(req: Request, res: Response) {
    const { id } = req.params;
    const exception = await updateAvailabilityException(req.userId, Number(id), req.body);
    sendSuccess(res, exception, HTTPStatusCodes.OK, "Availability exception updated successfully");
}

export async function removeException(req: Request, res: Response) {
    const { id } = req.params;
    await deleteAvailabilityException(req.userId, Number(id));
    sendSuccess(res, null, HTTPStatusCodes.OK, "Availability exception deleted successfully");
}

