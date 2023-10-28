import { Collection, Db, WithId } from 'npm:mongodb';
import { Lift, LiftFilterCriteron, LiftUtilService } from "./shared.ts";

export class MongoLiftService {
    mongoConnection: Db;
    private readonly liftUtilService: LiftUtilService;
    lifts: Collection<Lift>;

    constructor(mongoConnection: Db) {
        this.mongoConnection = mongoConnection;
        this.liftUtilService = new LiftUtilService();
        this.lifts = this.mongoConnection.collection('lifts');
    }

    private matches(lift: Lift, liftFilterCriteria: LiftFilterCriteron) {
        if (liftFilterCriteria.floor !== undefined && lift.level != liftFilterCriteria.floor) {
            return false;
        }

        if (liftFilterCriteria.min_floor !== undefined && lift.level < liftFilterCriteria.min_floor) {
            return false;
        }

        if (liftFilterCriteria.max_floor !== undefined && lift.level > liftFilterCriteria.max_floor) {
            return false;
        }

        if (liftFilterCriteria.direction !== undefined && lift.direction !== liftFilterCriteria.direction) {
            return false;
        }

        return true;
    }

    async getElevatorById(id: number): Promise<Lift | null> {
        const lift = await this.lifts.findOne({ id });
        if (lift) return Promise.resolve(lift);
        return Promise.resolve(null);
    }

    async getAllLifts(): Promise<WithId<Lift>[]> {
        return Promise.resolve(await this.lifts.find().toArray());
    }

    async getAllLiftsMatching(liftFilterCriteria: LiftFilterCriteron): Promise<Lift[]> {
        const ret: Lift[] = [];
        const lifts = await this.lifts.find().toArray();
        for (const lift of lifts) {
            if (this.matches(lift, liftFilterCriteria)) {
                ret.push(lift);
            }
        }
        return Promise.resolve(ret);
    }

    async processDoorOpen(liftId: number, level: number): Promise<boolean> {
        const lift = await this.getElevatorById(liftId);
        if(!lift){
            return Promise.resolve(false);
        }
        lift.destinations = this.liftUtilService.removeFromArray(lift.destinations, level);
        lift.direction = this.liftUtilService.computeDirection(lift);
        await this.lifts.findOneAndUpdate(
            { id: lift.id },
            { $set: { destinations: lift.destinations, direction: lift.direction } },
            { returnDocument: 'after' }
        );
        return Promise.resolve(true);
    }

    async processAddDestination(liftId: number, level: number): Promise<boolean> {
        const lift = await this.getElevatorById(liftId);
        if(!lift){
            return Promise.resolve(false);
        }
        lift.destinations = this.liftUtilService.addDestination(lift.destinations, lift.level, level);
        lift.direction = this.liftUtilService.computeDirection(lift);
        await this.lifts.findOneAndUpdate(
            { id: lift.id },
            { $set: { destinations: lift.destinations, direction: lift.direction } },
            { returnDocument: 'after' }
        );
        return Promise.resolve(true);
    }

    async processLiftMovement(liftId: number, level: number): Promise<boolean> {
        const lift = await this.getElevatorById(liftId);
        if(!lift){
            return Promise.resolve(false);
        }
        lift.level = level;
        await this.lifts.findOneAndUpdate(
            { id: lift.id },
            { $set: { level: lift.level } },
            { returnDocument: 'after' }
        );
        return Promise.resolve(true);
    }
}