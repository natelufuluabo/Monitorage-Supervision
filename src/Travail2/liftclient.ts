type lift = {
    id: number,
    level: number
}

class LiftClient {
    host: string;

    constructor(host:string) {
        this.host = host;
    }

    async getLiftsList(): Promise<lift[]> {
        const lifts = await fetch(this.host);
        const data = await lifts.json();
        return data.lifts;
    }
}

const liftClient = new LiftClient('http://localhost:8000/api/v1/lifts');

console.log(await liftClient.getLiftsList());