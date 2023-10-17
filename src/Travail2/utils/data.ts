// deno-lint-ignore-file prefer-const
import { liftDetail, liftRequest } from './types.ts';

export let liftRequests: liftRequest[] = [];

export let liftDetailsList: liftDetail[] = [
    {
        "id": 1,
        "level": 3,
        "direction": "UP", 
        "destinations": [3, 8, 11, 18],
    },
    {
        "id": 2,
        "level": 7,
        "direction": "IDLE", 
        "destinations": [],
    },
    {
        "id": 3,
        "level": 10,
        "direction": "DOWN", 
        "destinations": [9, 6, 4, 1],
    },
    {
        "id": 4,
        "level": 12,
        "direction": "UP", 
        "destinations": [14, 15, 16, 17],
    }
];
