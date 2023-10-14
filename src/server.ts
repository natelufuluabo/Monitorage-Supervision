import express, { Response, Request } from 'npm:express@4';
const app = express()
const port = 8000
let counter = 0;
app.get('/', (req: Request, res: Response) => res.send('Hello World!'))
app.get('/counter', (req: Request, res: Response) => {
    counter++;
    res.send(`${counter}`);
})
app.get('/sleep', (req: Request, res: Response) => {
    setTimeout(() => {
        res.send('zzzzZZZZZzzzZZZ');
    }, 5000);
})

app.get('/example.com', async (req: Request, res: Response) => {
    const exampleData = await fetch('http://example.com');
    const response = await exampleData.text()
    res.send(response);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))