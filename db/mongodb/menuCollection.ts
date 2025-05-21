import { ObjectId, WithId } from 'mongodb';
import { mongoConnection } from './connection';
import { MenuItem, MenuItemWithID } from '@/types/system/menu';
import { getUniquePermissions } from './userCollection';

function dbMenusToLocalMenus(dbMenus: WithId<MenuItem>[]): MenuItemWithID[] {
    return dbMenus.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest, // 保留其他字段
        };
    });
}

export async function getMenusByRoles(roleIds: string[]) {
    return await mongoConnection(async (db) => {
        const uniquePermissions = await getUniquePermissions(roleIds, db);
        if (!uniquePermissions) {
            return []
        }
        const permissionsObjectIDs = uniquePermissions.map(id => new ObjectId(id))
        const usersCollection = db.collection<WithId<MenuItem>>('menus');
        // type不为button
        const menus = await usersCollection.find({ _id: { $in: permissionsObjectIDs }, type: { $ne: 'button' } }).toArray();
        return dbMenusToLocalMenus(menus);
    })
}

export async function getAllMenus() {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<WithId<MenuItem>>('menus');
        return dbMenusToLocalMenus(await usersCollection.find({}).toArray());
    })
}