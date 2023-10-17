import express, { Response, Request } from 'npm:express@4';
import bodyParser from "npm:body-parser@1.20.1"
import { lift, liftDetail } from './utils/types.ts';
import { liftDetailsList } from './utils/data.ts';

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.get('/api/v1/lifts', function(req: Request, res: Response): lift[] {
    if (req.query.floor) {
        const floor = Number(req.query.floor);
        const lifts = liftDetailsList.filter(lift => lift.level == floor);
        if (lifts.length > 0) {
            const data = lifts.map(item => ({
                id: item.id,
                level: item.level
            }));
            return res.json(data);
        }
        return res.json({ "error": "Not Found." });
    }
    if (req.query.min_floor) {
        const min_floor = Number(req.query.min_floor);
        const lifts = liftDetailsList.filter(lift => lift.level >= min_floor);
        if (lifts.length > 0) {
            const data = lifts.map(item => ({
                id: item.id,
                level: item.level
            }));
            return res.json(data);
        }
        return res.json({ "error": "Not Found." });
    }
    if (req.query.max_floor) {
        const max_floor = Number(req.query.max_floor);
        const lifts = liftDetailsList.filter(lift => lift.level <= max_floor);
        if (lifts.length > 0) {
            const data = lifts.map(item => ({
                id: item.id,
                level: item.level
            }));
            return res.json(data);
        }
        return res.json({ "error": "Not Found." });
    }
    if (req.query.direction) {
        const direction = req.query.direction;
        const lifts = liftDetailsList.filter(lift => lift.direction === direction);
        if (lifts.length > 0) {
            const data = lifts.map(item => ({
                id: item.id,
                level: item.level
            }));
            return res.json(data);
        }
        return res.json({ "error": "Not Found." });
    }
    const data = liftDetailsList.map(item => ({
        id: item.id,
        level: item.level
    }));
    return res.json(data);
});

app.get('/api/v1/lifts/:id', function(req: Request, res: Response): liftDetail {
    const id = Number(req.params.id);
    const lift = liftDetailsList.find(lift => lift.id === id);
    if (lift) return res.json(lift);
    return res.json({ "error": "Not Found." });
});

app.put('/api/v1/lifts/:id', function(req: Request, res: Response): liftDetail {
    const id = Number(req.params.id);
    const body = req.body;
    const index = liftDetailsList.findIndex(lift => lift.id === id);
    if (body.action === 'door-open') {
        if (index !== -1) {
            const updatedLift: liftDetail = { 
                ...liftDetailsList[index], 
                destinations: liftDetailsList[index].level === liftDetailsList[index].destinations[0] ? liftDetailsList[index].destinations.splice(1) : liftDetailsList[index].destinations, 
                action: body.action, direction: 'IDLE' 
            };
            liftDetailsList[index] = updatedLift;
            return res.json(updatedLift);
        } 
        return res.json({ "error": "Not Found." });
    }
    if (body.action === 'add-destination') {
        if (index !== -1) {
            const updatedLift: liftDetail = { 
                ...liftDetailsList[index], 
                direction: liftDetailsList[index].destinations.length === 0 ? (liftDetailsList[index].level > body.destination ? "DOWN" : "UP") : liftDetailsList[index].direction,
                destinations: liftDetailsList[index].destinations.concat(body.destination), 
                action: body.action,  
            };
            liftDetailsList[index] = updatedLift;
            return res.json(updatedLift);
        }
    }
    if (index !== -1) {
        const updatedLift = { ...liftDetailsList[index], action: 'lift-move', level: body.level };
        liftDetailsList[index] = updatedLift;
        return res.json(updatedLift);
    }
    return res.json({ "error": "Not Found." });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))