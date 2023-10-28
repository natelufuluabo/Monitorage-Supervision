import { Lift } from "./types.ts";

export class LiftUtilService{

    private isBetween(x: number, min_: number, max_: number): boolean{
        return min_ < x && x < max_;
    }

    addDestination(destinations: number[], currentLevel: number, newDestination: number){
        if(destinations.length === 0){
            return [newDestination];
        }
        if(destinations.includes(newDestination)){
            return destinations;
        }

        const firstDestination = destinations[0];
        if(this.isBetween(newDestination, currentLevel, firstDestination)){
            return [newDestination].concat(destinations);

        }
        for(let i = 0; i < destinations.length - 1; i++){
            const first = destinations[i];
            const second = destinations[i + 1];
            if(this.isBetween(newDestination, first, second)){
                const firstPart = destinations.slice(0, i + 1);
                const secondPart = destinations.slice(i + 1);
                return firstPart.concat([newDestination]).concat(secondPart);
            }
        }
        return destinations.concat([newDestination]);
    }

    computeDirection(lift: Lift): string {
        if(lift.destinations.length === 0){
            return "IDLE";
        }
        const nextDestination = lift.destinations[0];
        if(nextDestination === lift.level){
            return lift.direction;
        }
        if(nextDestination > lift.level){
            return "UP";
        }
        return "DOWN";
    }

    removeFromArray(lst: number[], toRemove: number): number[] {
        const ret: number[] = [];
        for(const e of lst){
            if(e !== toRemove){
                ret.push(e);
            }
        }
        return ret
    }

}