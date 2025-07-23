import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGODB_URL!);

export function dbConnection() {
    return client.db(process.env.MONGODB_DB);
}

export async function sessionTask<T>(callback: () => Promise<T>) {
    const session = client.startSession();
    try {
        return await session.withTransaction(async () => {
            return await callback()
        }, {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        });

    } catch (error) {
        throw error
    } finally {
        await session.endSession();
    }
}
