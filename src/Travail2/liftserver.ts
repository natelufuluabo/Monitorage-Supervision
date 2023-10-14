// deno-lint-ignore-file no-unused-vars
import express, { Response, Request } from 'npm:express@4';
import { lift, liftDetail } from './utils/types.ts';
import { liftsList, liftDetailsList } from './utils/data.ts';

const app = express();
const port = 8000;

app.get('/api/v1/lifts', function(req: Request, res: Response): lift[] {
    return res.json(liftsList);
});

app.get('/api/v1/lifts/:id', function(req: Request, res: Response): liftDetail {
    const id: number = req.params.id;
    const lift = liftDetailsList.find(lift => lift.id === id);
    return res.json(lift);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))