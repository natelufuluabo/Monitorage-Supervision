import { Collection, Db, WithId } from 'npm:mongodb';
import { LiftRequest } from "./utils/types.ts";

export class MongoButtonService {
    mongoConnection: Db;
    liftRequests: Collection<LiftRequest>;

    constructor(mongoConnection: Db) {
        this.mongoConnection = mongoConnection;
        this.liftRequests = this.mongoConnection.collection('lift_requests');

    }
    
    async addLiftRequest(liftRequest: LiftRequest): Promise<boolean> {
        const existingRequest = await this.liftRequests.findOne(
            { $and: [{ level: liftRequest.level, direction: liftRequest.direction }] }
        );
        if (existingRequest) return Promise.resolve(false);
        await this.liftRequests.insertOne(liftRequest);
        return Promise.resolve(true);
    }

    async getLiftRequests(): Promise<WithId<LiftRequest>[]>{
        return Promise.resolve(await this.liftRequests.find().toArray());
    }
}