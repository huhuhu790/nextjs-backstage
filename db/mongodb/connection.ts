import { MongoClient, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL!);

export async function mongoConnection<T>(callback: (db: Db) => Promise<T>) {
    const db = client.db(process.env.MONGODB_DBNAME);
    return await callback(db);
}