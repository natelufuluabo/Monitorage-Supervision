import express, { Response, Request } from 'npm:express@4';
const app = express();
const port = 8000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))