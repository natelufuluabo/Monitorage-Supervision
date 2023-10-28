import { Response } from "npm:express";
import { Lift, LiftAction, LiftFilterCriteron, LiftSearchRequestParams, SmallLiftRepresentation } from "./types.ts";
import { MongoLiftService } from "../mongoLiftService.ts";
import { db } from "../db.ts";

export function send404(res: Response): void {
    res.status(404);
    res.send({});
}

export function send400(res: Response): void {
    res.status(400);
    res.send({});
}

export async function createInMemoryLiftService() {
    await db.collection("lifts").createIndex({id: 1}, {unique: true});
    const defaultLifts = [
        {id: 1, level: 12, direction: 'IDLE', destinations: []},
        {id: 2, level: -1, direction: 'IDLE', destinations: []},
        {id: 3, level: 5, direction: 'IDLE', destinations: []},
        {id: 4, level: 17, direction: 'IDLE', destinations: []},
    ];
    for(const lift of defaultLifts){
        await db.collection("lifts").updateOne({id: lift.id}, {"$setOnInsert": lift}, {upsert: true});
    }
    return new MongoLiftService(db);
}

export function toSmallRepresentation(lifts: Lift[]): SmallLiftRepresentation[] {
    const ret: SmallLiftRepresentation[] = [];
    for (const lift of lifts) {
        ret.push({id: lift.id, level: lift.level});
    }
    return ret;

}

export function liftSearchRequestParamsToLiftFilterCriteria(query: LiftSearchRequestParams): LiftFilterCriteron {
    const ret: LiftFilterCriteron = {};
    if (query.direction !== undefined) {
        ret.direction = query.direction;
    }
    if (query.floor !== undefined) {
        ret.floor = parseInt(query.floor);
    }
    if (query.max_floor !== undefined) {
        ret.max_floor = parseInt(query.max_floor);
    }
    if (query.min_floor !== undefined) {
        ret.min_floor = parseInt(query.min_floor);
    }
    return ret;
}

export function isLevel(x: number): boolean{
    const allLevels = [
        -2, -1, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18];
    return allLevels.includes(x);
}

export function isValidAction(action?: LiftAction): boolean {
    if(!action){
        return false;
    }
    if(action.type === "lift-move" || action.type === "door-open" ){
        return isLevel(action.level!);
    }
    if(action.type === "add-destination" ){
        return isLevel(action.destination!);
    }
    return false;
}