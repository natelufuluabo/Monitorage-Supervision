import { liftRequest } from "./utils/types.ts";

class ButtonClient {
    host: string;

    constructor(host: string) {
        this.host = host;
    }

    async getLiftRquestsList(): Promise<liftRequest[]> {
        const liftRquestsList = await fetch(this.host);
        const data = await liftRquestsList.json();
        return data;
    }

    async saveLiftRequest(liftRequest: liftRequest): Promise<liftRequest> {
        const lift = await fetch(this.host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(liftRequest)
        });
        const data = await lift.json();
        return data;
    }
}

const buttonClient = new ButtonClient('http://localhost:8000/api/v1/lift-requests');

const liftRequest: liftRequest = {
    "action": "ask-lift",
    "level": 14,
    "direction": "UP"
}
console.log(await buttonClient.saveLiftRequest(liftRequest));
console.log(await buttonClient.getLiftRquestsList());