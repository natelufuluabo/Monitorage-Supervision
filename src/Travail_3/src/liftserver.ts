import express, {Response, Request} from "npm:express";
import bodyParser from "npm:body-parser";
import { db } from "./db.ts";
import { MongoButtonService } from "./mongoButtonService.ts";
import { MongoLiftService } from "./mongoLiftService.ts";
import {Lift, LiftFilterCriteron, LiftRequest, SmallLiftRepresentation, LiftUtilService} from "./shared.ts";

const app = express()
app.use(bodyParser.json());

const port = 3000;

type LiftSearchRequestParams = {
    floor?: string,
    min_floor?: string,
    max_floor?: string,
    direction?: string,
}

type LiftAction = {
    type: string,
    level?: number,
    destination?: number,
}

async function createInMemoryLiftService() {
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

function toSmallRepresentation(lifts: Lift[]): SmallLiftRepresentation[] {
    const ret: SmallLiftRepresentation[] = [];
    for (const lift of lifts) {
        ret.push({id: lift.id, level: lift.level});
    }
    return ret;

}

function liftSearchRequestParamsToLiftFilterCriteria(query: LiftSearchRequestParams): LiftFilterCriteron {
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

function isLevel(x: any): boolean{
    const allLevels = [
        -2, -1, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18];
    return allLevels.includes(x);
}

function isValidAction(action?: LiftAction): boolean {
    if(!action){
        return false;
    }
    if(action.type === "lift-move" || action.type === "door-open" ){
        return isLevel(action.level);
    }
    if(action.type === "add-destination" ){
        return isLevel(action.destination);
    }
    return false;
}

const liftService = createInMemoryLiftService();

const buttonService = new MongoButtonService(db);

function send404(res: Response): void {
    res.status(404);
    res.send({});
}

function send400(res: Response): void {
    res.status(400);
    res.send({});
}

app.get('/api/v1/lifts', async (req: Request, res: Response): Promise<void> => {
    const query = req.query as LiftSearchRequestParams;
    const criterion = liftSearchRequestParamsToLiftFilterCriteria(query);
    const ret = await (await liftService).getAllLiftsMatching(criterion);
    res.send({lifts: toSmallRepresentation(ret)})
});

app.get('/api/v1/lifts/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = req.params.id;
    const ret = await (await liftService).getElevatorById(parseInt(id));
    if (ret == null) {
        return send404(res);
    }
    res.send(ret)
});

app.post('/api/v1/lifts/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const ret = await (await liftService).getElevatorById(id);
    if (ret == null) {
        return send404(res);
    }
    const action = req.body as LiftAction | null;
    if(!action || !isValidAction(action)){
        return send400(res)
    }
    if(action.type === 'lift-move'){
        await (await liftService).processLiftMovement(id, action.level!);
    }
    if(action.type === 'door-open'){
        await (await liftService).processDoorOpen(id, action.level!);
    }
    if(action.type === 'add-destination'){
        await (await liftService).processAddDestination(id, action.destination!);
    }

    res.send(await (await liftService).getElevatorById(id))
});

app.get('/api/v1/lift-requests',  async (_req: Request, res: Response): Promise<void> => {
    res.send(await buttonService.getLiftRequests());
});

app.post('/api/v1/lift-requests',  async (req: Request, res: Response): Promise<void> => {
    const changed = await buttonService.addLiftRequest(req.body as LiftRequest);
    res.send({changed: changed});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
