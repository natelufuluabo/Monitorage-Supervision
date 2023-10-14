import express, { Response, Request } from 'npm:express@4';
const app = express();
const port = 8000;

app.get('/api/v1/lifts', function(req: Request, res: Response) {
    return res.json({
        "lifts": [
            {"id": 1, "level": 14},
            {"id": 2, "level": 12},
            {"id": 3, "level": 1},
            {"id": 4, "level": -1}
        ]
    })
});

app.get('/api/v1/lifts/:id', function(req: Request, res: Response) {
    const id = req.params.id;
    const lift = {
        "id": 3,
        "level": 14,
        "direction": "UP", 
        "destinations": [15, 16, 17, 4, 2],
    }
    return res.json(lift);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))