import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL!);

export async function dbConnectionMes() {
    return client.db(process.env.MONGODB_DB_MES);
}