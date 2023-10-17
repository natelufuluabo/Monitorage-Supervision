import { lift, liftDetail } from './utils/types.ts';

class LiftClient {
    host: string;

    constructor(host:string) {
        this.host = host;
    }

    async getLiftsList(): Promise<lift[]> {
        const lifts = await fetch(this.host);
        const data = await lifts.json();
        return data;
    }

    async getLiftAtLevel(floor: number): Promise<lift[]> {
        const lifts = await fetch(`${this.host}?foor=${floor}`);
        const data = await lifts.json();
        return data;
    }

    async getLiftAtLevelAbove(min_floor: number): Promise<lift[]> {
        const lifts = await fetch(`${this.host}?min_floor=${min_floor}`);
        const data = await lifts.json();
        return data;
    }

    async getLiftAtLevelBelow(max_floor: number): Promise<lift[]> {
        const lifts = await fetch(`${this.host}?max_floor=${max_floor}`);
        const data = await lifts.json();
        return data;
    }

    async getLiftDirection(direction: string): Promise<lift[]> {
        const lifts = await fetch(`${this.host}?direction=${direction}`);
        const data = await lifts.json();
        return data;
    }

    async getLiftDetail(id: number): Promise<liftDetail> {
        const lift = await fetch(`${this.host}/${id}`);
        const data = await lift.json();
        return data;
    }

    async updateLiftLevel(id:number, level: number): Promise<liftDetail> {
        const newLevel = { level: level }
        const lift = await fetch(`${this.host}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLevel)
        });
        const data = await lift.json();
        return data;
    }

    async openLiftDoors(id:number): Promise<liftDetail> {
        const newAction = { action: 'door-open' }
        const lift = await fetch(`${this.host}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAction)
        });
        const data = await lift.json();
        return data;
    }
}

const liftClient = new LiftClient('http://localhost:8000/api/v1/lifts');

console.log(await liftClient.openLiftDoors(3));
console.log(await liftClient.getLiftsList());