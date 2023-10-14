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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))