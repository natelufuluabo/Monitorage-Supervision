import { lift, liftDetail } from './utils/types.ts';

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

    async getLift(id: number): Promise<liftDetail> {
        const lift = await fetch(`${this.host}/${id}`);
        const data = await lift.json();
        return data;
    }
}

const liftClient = new LiftClient('http://localhost:8000/api/v1/lifts');

console.log(await liftClient.getLift(3));