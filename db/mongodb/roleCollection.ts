import { WithId } from "mongodb";
import { mongoConnection } from "./connection";
import { RoleItem, RoleItemWithID } from "@/types/system/role";

function dbRolesToLocalRoles(dbRoles: WithId<RoleItem>[]): RoleItemWithID[] {
    return dbRoles.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest, // 保留其他字段
        };
    });
}

export async function getRoleAll() {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<RoleItem>('roles');
        return dbRolesToLocalRoles(await usersCollection.find({}).toArray());
    })
}