import express, {Response, Request} from "npm:express";
import bodyParser from "npm:body-parser";
import { db } from "./db.ts";
import { MongoButtonService } from "./mongoButtonService.ts";
import { LiftAction, LiftRequest, LiftSearchRequestParams } from "./utils/types.ts";
import { createInMemoryLiftService, isValidAction, liftSearchRequestParamsToLiftFilterCriteria, send400, send404, toSmallRepresentation } from "./utils/functions.ts";

const app = express()
app.use(bodyParser.json());

const port = 3000;

const liftService = createInMemoryLiftService();

const buttonService = new MongoButtonService(db);

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
