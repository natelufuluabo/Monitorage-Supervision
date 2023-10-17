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

app.put('/api/v1/lifts/:id', function(req: Request, res: Response) {
    const id = Number(req.params.id);
    const newLevel = Number(req.body.level);
    console.log(req.body, newLevel);
    const index = liftDetailsList.findIndex(lift => lift.id === id);
    if (index !== -1) {
        const updatedLift = { ...liftDetailsList[index], action: 'lift-move', level: newLevel };
        liftDetailsList[index] = updatedLift;
        return res.json(updatedLift);
    }
    return res.json({ "error": "Not Found." });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))