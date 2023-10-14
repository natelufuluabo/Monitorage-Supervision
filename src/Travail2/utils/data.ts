import { lift, liftDetail } from './types.ts';

export const liftsList: lift[] = [
    {"id": 1, "level": 3},
    {"id": 2, "level": 7},
    {"id": 3, "level": 10},
    {"id": 4, "level": 12}
];

export const liftDetailsList: liftDetail[] = [
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