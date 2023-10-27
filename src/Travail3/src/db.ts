import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI!; 
const dbName = 'Gargantuesca';

let db: Db | null = null;

export async function connectToDatabase() {
  try {
    if (db === null) {
      const client = new MongoClient(url);
      await client.connect();
      db = client.db(dbName);
      console.log('Connected to the database');
    }
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
}

export function getDb(): Db {
  if (db === null) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}
