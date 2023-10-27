import { MongoClient, Db } from 'npm:mongodb';
import { config } from "https://deno.land/x/dotenv/mod.ts";

const connectionString = config().MONGODB_URI;
const client = new MongoClient(connectionString);
const conn = await client.connect();
export const db: Db = conn.db("Gargantuesca");