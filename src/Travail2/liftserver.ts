import express, { Response, Request } from 'npm:express@4';
import bodyParser from "npm:body-parser@1.20.1"
import { lift, liftDetail } from './utils/types.ts';
import { liftsList, liftDetailsList } from './utils/data.ts';

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.get('/api/v1/lifts', function(req: Request, res: Response): lift[] {
    if (req.query.floor) {
        const floor = Number(req.query.floor);
        const lifts = liftsList.filter(lift => lift.level == floor);
        return res.json(lifts);
    }
    if (req.query.min_floor) {
        const min_floor = Number(req.query.min_floor);
        const lifts = liftsList.filter(lift => lift.level >= min_floor);
        return res.json(lifts);
    }
    if (req.query.max_floor) {
        const max_floor = Number(req.query.max_floor);
        const lifts = liftsList.filter(lift => lift.level <= max_floor);
        return res.json(lifts);
    }
    if (req.query.direction) {
        const direction = req.query.direction;
        const lifts = liftDetailsList.filter(lift => lift.direction === direction);
        const result = lifts.map(lift => {
            const matchingLift = liftsList.find(item => item.id === lift.id);
            return matchingLift
        });
        return res.json(result);
    }
    return res.json(liftsList);
});

app.get('/api/v1/lifts/:id', function(req: Request, res: Response): liftDetail {
    const id = Number(req.params.id);
    const lift = liftDetailsList.find(lift => lift.id === id);
    return res.json(lift);
});

app.post('/api/v1/lifts/:id', function(req: Request, res: Response): liftDetail {
    const id = Number(req.params.id);
    const newLevel = Number(req.body.level);
    const updatedLift = { ...liftDetailsList.find(lift => lift.id === id), action: 'lift-move', level: newLevel };
    return res.json(updatedLift);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))